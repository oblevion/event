const db = require("../config/db");

exports.createRegistration = (data, callback) => {
  const sql = `
    INSERT INTO registrations
    (name, email, phone, payment_id,order_id, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, data, callback);
};

exports.getAllRegistrations = callback => {
  db.query("SELECT * FROM registrations", callback);
};