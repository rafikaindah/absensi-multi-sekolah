const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const adminDashboardController = require("../controllers/adminDashboardController");

router.use(auth, roleCheck(["admin"]));

// dashboard routes
router.get("/dashboard/summary", adminDashboardController.getSummary);
router.get("/dashboard/today-presensi-guru", adminDashboardController.getTodayPresensiGuru);
router.get("/dashboard/today-absensi-siswa", adminDashboardController.getTodayAbsensiSiswa);

module.exports = router;
