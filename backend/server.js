const connect = require("./connect.js");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./userRoutes.js");
require("dotenv").config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(userRoutes);

// Start server only after DB connects
const startServer = async () => {
  try {
    await connect.connectToServer();   // connect to MongoDB first
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);  // exit if DB not connected
  }
};

startServer();
