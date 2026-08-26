const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { initializePayment, verifyPayment } = require("../controllers/paymentController");

router.post("/initialize/:bookingId", auth, initializePayment);
router.get("/verify", auth, verifyPayment);

module.exports = router;