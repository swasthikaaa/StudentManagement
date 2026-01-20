try {
    require('dotenv').config();
    console.log("Dotenv loaded");

    console.log("Loading studentRoutes...");
    require('./routes/studentRoutes');

    console.log("Loading authRoutes...");
    require('./routes/authRoutes');

    console.log("Loading paymentRoutes...");
    require('./routes/paymentRoutes');

    console.log("Loading gradeRoutes...");
    require('./routes/gradeRoutes');

    console.log("Loading timetableRoutes...");
    require('./routes/timetableRoutes');

    console.log("All routes loaded successfully.");
} catch (e) {
    console.error("ROUTE IMPORT ERROR:");
    console.error(e.message);
    console.error(e.stack);
}
