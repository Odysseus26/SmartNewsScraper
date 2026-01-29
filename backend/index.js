import exportSearch from "./Reader_Files/directoryList.js";
import getResponse from "./Reader_Files/paragon.js";
import updateProcess from "./update.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 2000;

// search route
app.post("/api/search", (req, res) => {
  res.json({ data: exportSearch(req.body.value) });
});

// summary route — now async
app.post("/api/summary", async (req, res) => {
  try {
    const ans = await getResponse(req.body.value);
    res.json({ data: ans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal AI Request Server Error" });
  }
});

app.post("/api/update", async (req,res) => {
  try {
    const ans = await updateProcess();
    res.json({ data:ans })
  } catch (err) {
    console.error(err)
    res.status(500).json({error:"Updating Internal Server Error"})
  }
})


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);



/* const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); // ← MUST run before routes
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(2000, () => console.log("Server running on port 3000")); */

