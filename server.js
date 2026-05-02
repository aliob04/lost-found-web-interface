const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const ITEM_URL = process.env.ITEM_URL;
const SEARCH_URL = process.env.SEARCH_URL;
const AUTH_URL = process.env.AUTH_URL;

app.post("/api/google-login", async (req, res) => {
  const { credential } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  res.json({
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  });
});

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
  const type = req.query.type;
  const url = type ? `${ITEM_URL}/items?type=${type}` : `${ITEM_URL}/items`;

  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  const type = req.query.type || "";
  const response = await fetch(`${SEARCH_URL}/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`);
  const data = await response.json();
  res.json(data);
});
app.post("/api/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    res.json({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(401).json({ error: "Google login failed" });
  }
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
