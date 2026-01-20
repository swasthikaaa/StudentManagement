try {
    console.log("Checking Grade Routes...");
    try { require('./routes/gradeRoutes'); console.log("Grade Routes OK"); } catch (e) { console.error("Grade Routes FAIL:", e.message); }

    console.log("Checking Timetable Routes...");
    try { require('./routes/timetableRoutes'); console.log("Timetable Routes OK"); } catch (e) { console.error("Timetable Routes FAIL:", e.message); }

} catch (e) {
    console.error("GLOBAL FAIL:", e.message);
}
