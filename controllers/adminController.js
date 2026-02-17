const db = require("../controllers/admin.controller");

exports.getRegistrations = (req, res) => {
  db.query("SELECT * FROM registrations", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};