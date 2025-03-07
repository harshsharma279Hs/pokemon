const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get a list of Pokémon (limit 151 for Gen 1)
app.get("/api/pokemons", async (req, res) => {
  try {
    console.log("Fetching Pokémon list...");
    const response = await axios.get(`${POKEAPI_BASE_URL}?limit=151`);
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error.message);
    res.status(500).json({ error: "Internal server error while fetching Pokémon list" });
  }
});

// Get Pokémon details by ID
app.get("/api/pokemon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching details for Pokémon ID: ${id}`);
    
    const response = await axios.get(`${POKEAPI_BASE_URL}/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching Pokémon details for ID ${req.params.id}:`, error.message);
    res.status(404).json({ error: "Pokémon not found or invalid ID" });
  }
});

// Search Pokémon by name
app.get("/api/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name query parameter is required" });
    }

    console.log(`Searching for Pokémon: ${name}`);
    const response = await axios.get(`${POKEAPI_BASE_URL}/${name.toLowerCase()}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error searching for Pokémon: ${req.query.name}`, error.message);
    res.status(404).json({ error: "Pokémon not found. Please check the name and try again." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
