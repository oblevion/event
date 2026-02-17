const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const db = require("../config/db");

exports.createOrder = async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 5 * 100,
      currency: "INR",
      receipt: "event_receipt",
    });

    res.json({
  key: process.env.RAZORPAY_KEY_ID,
  orderId: order.id,
  amount: order.amount
});
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.verifyPayment = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    phone,
  } = req.body;

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  const sql = `
    INSERT INTO registrations
    (name, email, phone, payment_id, amount, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone, razorpay_payment_id, 500, "PAID"],
    err => {
      if (err)
        return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
};