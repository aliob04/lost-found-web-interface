require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const ITEM_URL = process.env.ITEM_URL;
const SEARCH_URL = process.env.SEARCH_URL;
const AUTH_URL = process.env.AUTH_URL;

app.post("/api/items", async (req, res) => {
  const response = await fetch(`${ITEM_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.json(data);
});

app.get("/api/items", async (req, res) => {
  const response = await fetch(`${ITEM_URL}/items`);
  const data = await response.json();
  res.json(data);
});

app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  const response = await fetch(`${SEARCH_URL}/search?q=${encodeURIComponent(q)}`);
  const data = await response.json();
  res.json(data);
});

app.post("/api/login", async (req, res) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Web interface running on port ${PORT}`));
