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
    console.log("KEY SENT:", process.env.RAZORPAY_KEY_ID);
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
  console.log("VERIFY PAYMENT HIT", req.body); // 👈 DEBUG

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
    console.error("SIGNATURE MISMATCH");
    return res.status(400).json({ success: false });
  }

  const sql = `
    INSERT INTO registrations
    (name, email, phone, payment_id, order_id, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      phone,
      razorpay_payment_id,
      razorpay_order_id,
      5,
      "PAID"
    ],
    (err, result) => {
      if (err) {
        console.error("DB INSERT ERROR:", err);
        return res.status(500).json({ success: false });
      }

      console.log("DB INSERT SUCCESS, ID:", result.insertId);
      res.json({ success: true });
    }
  );
};