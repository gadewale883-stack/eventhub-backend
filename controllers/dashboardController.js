const Event = require('../models/Event');
const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$totalAmount'
          }
        }
      }
    ]);

    res.json({
      totalEvents,
      totalBookings,
      totalRevenue: revenue.length ? revenue[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};