const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 500, // ₹5 = 500 paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      key_id: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  console.log("VERIFY PAYMENT HIT");
  console.log("BODY:", req.body);
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
      5,
      "PAID",
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ success: false });
  }
};