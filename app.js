const express = require("express");

const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cors());
app.use(express.json());

app.use('/auth',require("./routes/auth.routes"))

app.get("/", (req, res) => res.send("Ticket Management API"));

module.exports = app;

