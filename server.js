require("dotenv").config();
const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0",() =>
  console.log(`Server running on port ${PORT}`)
);