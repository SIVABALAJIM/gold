const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // To load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/goldgauge")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// Gold Rate Schema (Mongoose Model)
const goldRateSchema = new mongoose.Schema({
  rate: Number,
  date: String,
});
const GoldRate = mongoose.model("GoldRate", goldRateSchema);

// API: Add New Gold Rate
app.post("/addRate", async (req, res) => {
  try {
    const { rate, date } = req.body;
    const newRate = new GoldRate({ rate, date });
    await newRate.save();
    res.json({ message: "Gold rate saved successfully!", data: newRate });
  } catch (error) {
    res.status(500).json({ error: "Failed to save gold rate" });
  }
});

// API: Get All Gold Rates
app.get("/getRates", async (req, res) => {
  try {
    const rates = await GoldRate.find();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gold rates" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
