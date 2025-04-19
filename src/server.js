const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/auth", require("./routes/auth.routes"));
app.use("/admin", require("./routes/bus.routes"));
app.use("/", require("./routes/user.routes"));

app.get("/home", (req, res) => res.send("Ticket Management API"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
