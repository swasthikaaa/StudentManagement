try {
    console.log("1. Loading Student Model...");
    try { require('./models/Student'); console.log("   Student Model OK"); } catch (e) { console.error("   Student Model FAIL:", e.message); }

    console.log("2. Loading studentController...");
    try {
        const ctrl = require('./controllers/studentController');
        console.log("   studentController OK. Keys:", Object.keys(ctrl));
    } catch (e) { console.error("   studentController FAIL:", e.message); }

    console.log("3. Loading studentRoutes...");
    try { require('./routes/studentRoutes'); console.log("   studentRoutes OK"); } catch (e) { console.error("   studentRoutes FAIL:", e.message); }

} catch (e) {
    console.error("GLOBAL FAIL:", e.message);
}
