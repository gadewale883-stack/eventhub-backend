const axios = require('axios');
const Booking = require('../models/Booking');

exports.initializePayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const response = await axios.post('https://api.paystack.co/transaction/initialize',
      {
        email: booking.user.email,
        amount: booking.totalAmount * 100,
        callback_url: `${process.env.FRONTEND_URL}/payment-success.html`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    booking.paymentReference = response.data.data.reference;
    await booking.save();

    res.status(200).json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const reference = req.query.reference;

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    if (response.data.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment failed' });
    }

    const booking = await Booking.findOne({ paymentReference: reference })
      .populate('event');

    booking.paymentStatus = 'Paid';
    await booking.save();

    booking.event.availableSeats -= booking.quantity;
    await booking.event.save();

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};