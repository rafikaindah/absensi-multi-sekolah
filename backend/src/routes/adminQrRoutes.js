const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const adminQrController = require("../controllers/adminQrController");

router.get("/sekolah/:uuid", auth, roleCheck(["admin"]), adminQrController.getQrSekolah);

module.exports = router;
