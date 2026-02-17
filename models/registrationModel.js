const db = require("../config/db");

exports.createRegistration = (data, callback) => {
  const sql = `
    INSERT INTO registrations
    (order_id,name, email, phone, payment_id, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, data, callback);
};

exports.getAllRegistrations = callback => {
  db.query("SELECT * FROM registrations", callback);
};