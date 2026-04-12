import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/everything";

app.use(cors());
app.use(express.json());

function buildNewsUrl(query) {
  const params = new URLSearchParams({
    q: query,
    language: "en",
    sortBy: "relevancy",
    pageSize: "10"
  });
  return `${NEWS_API_URL}?${params.toString()}`;
}

app.post("/verify", async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim || typeof claim !== "string") {
      return res.status(400).json({ error: "Missing 'claim' string" });
    }

    console.log("Verifying claim:", claim);

    // Step 1: Call NewsAPI
    const url = buildNewsUrl(claim);
    const newsRes = await fetch(url, {
      headers: { "X-Api-Key": NEWS_API_KEY }
    });

    if (!newsRes.ok) {
      const text = await newsRes.text();
      console.error("NewsAPI error:", text);
      return res.status(500).json({ error: "News API error" });
    }

    const newsData = await newsRes.json();
    const articles = newsData.articles || [];

    // Step 2: Simple credibility scoring
    const articleCount = articles.length;
    const trustedSources = [
      "bbc.com",
      "reuters.com",
      "apnews.com",
      "nytimes.com",
      "theguardian.com",
      "indianexpress.com",
      "thehindu.com",
      "timesofindia.indiatimes.com",
      "cnn.com"
    ];

    let trustedMatches = 0;
    for (const a of articles) {
      try {
        const u = new URL(a.url);
        if (trustedSources.some(dom => u.hostname.includes(dom))) {
          trustedMatches++;
        }
      } catch (e) {}
    }

    let confidence = 0.4;
    let label = "Needs verification";
    let tone = "uncertain";
    const reasons = [];

    if (articleCount === 0) {
      confidence = 0.3;
      reasons.push("No matching coverage found in the sampled news sources.");
    } else {
      reasons.push(`Found ${articleCount} related articles in news sources.`);
      if (trustedMatches > 0) {
        reasons.push(`At least ${trustedMatches} article(s) from well-known outlets.`);
        confidence = 0.78;
        label = "Likely credible";
        tone = "true";
      } else {
        confidence = 0.52;
        label = "Needs verification";
        tone = "uncertain";
        reasons.push("Matches are from less-known sources, so extra verification is advised.");
      }
    }

    // Small random jitter
    confidence = Math.max(0.2, Math.min(0.95, confidence + (Math.random() - 0.5) * 0.1));

    const exampleArticles = articles.slice(0, 3).map(a => ({
      title: a.title,
      source: a.source?.name,
      url: a.url,
      publishedAt: a.publishedAt
    }));

    res.json({ confidence, label, tone, reasons, articles: exampleArticles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Arixion Verification API is running", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`Arixion Verification API running on http://localhost:${PORT}`);
});
