const express = require("express");
const router = express.Router();
const smtpController = require("../controller/smtpController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

console.log("SMTP Controller:", smtpController);

// SMTP Configuration Routes
router.get("/admin/smtp/config", isAuthentictedUser, authorizeRoles("admin"), smtpController.getSmtpConfig);
router.put("/admin/smtp/config", isAuthentictedUser, authorizeRoles("admin"), smtpController.updateSmtpConfig);

module.exports = router;
