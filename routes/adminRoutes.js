const express = require("express");
const router = express.Router();
const { getRegistrations } = require("../controllers/adminController");

router.get("/registrations", getRegistrations);

module.exports = router;