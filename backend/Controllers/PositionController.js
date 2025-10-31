const { Position } = require("../models/PositionModel");

module.exports.getPositions = async (req, res) => {
  try {
    const now = new Date();

    // Current day session (12:00 AM today → now)
    const sessionStart = new Date(now);
    sessionStart.setHours(0, 0, 0, 0); // 12:00 AM

    const sessionEnd = new Date(now);
    sessionEnd.setHours(23, 59, 59, 999); // 11:59:59 PM

    const userId = req.currentUser.id;

    // Fetch positions for today only
    const positions = await Position.find({
      userId,
      date: { $gte: sessionStart, $lte: sessionEnd }
    }).populate("stockId");

    // Cleanup old positions (before today)
    await Position.deleteMany({
      userId,
      date: { $lt: sessionStart }
    });

    res.json({ data: positions });

  } catch (err) {
    console.error("Error fetching positions:", err.message);
    res.status(500).json({
      error: "Failed to fetch positions",
      details: err.message
    });
  }
};
