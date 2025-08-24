const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
