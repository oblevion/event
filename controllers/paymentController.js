const db = require("../config/db");

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const sql = `
      INSERT INTO registrations
      (name, email, phone, payment_id, order_id, amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      name,
      email,
      phone,
      razorpay_payment_id,
      razorpay_order_id,
      500,
      "PAID",
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("DB INSERT ERROR:", err);
    res.status(500).json({ success: false });
  }
};