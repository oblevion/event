const db = require("../config/db");

exports.getRegistrations = (req, res) => {
  db.query(
    "SELECT * FROM registrations ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};