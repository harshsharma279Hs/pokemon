const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Get a list of Pokémon (limit 151 for Gen 1)
app.get("/api/pokemons", async (req, res) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}?limit=151`);
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Pokémon data" });
  }
});

// Get Pokémon details by ID
app.get("/api/pokemon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${POKEAPI_BASE_URL}/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Pokémon details" });
  }
});

// Search Pokémon by name
app.get("/api/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Name query parameter is required" });
    
    const response = await axios.get(`${POKEAPI_BASE_URL}/${name.toLowerCase()}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: "Pokémon not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
