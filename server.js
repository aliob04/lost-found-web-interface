require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const ITEM_URL = process.env.ITEM_URL;
const SEARCH_URL = process.env.SEARCH_URL;

app.post("/api/items", async (req, res) => {
  const r = await fetch(`${ITEM_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  const data = await r.json();
  res.json(data);
});

app.get("/api/items", async (req, res) => {
  const type = req.query.type;
  const url = type ? `${ITEM_URL}/items?type=${type}` : `${ITEM_URL}/items`;

  const r = await fetch(url);
  res.json(await r.json());
});

app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  const type = req.query.type;

  const r = await fetch(`${SEARCH_URL}/search?q=${q}&type=${type}`);
  res.json(await r.json());
});

app.listen(8080, () => console.log("web running"));