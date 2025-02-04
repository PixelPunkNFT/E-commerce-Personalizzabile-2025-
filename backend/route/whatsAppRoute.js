const express = require("express");
const whatsAppController = require("../controller/whatsAppController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

const router = express.Router();

router.get("/admin/whatsapp/number", whatsAppController.getWhatsAppNumber);
router.put("/admin/whatsapp/number/update", isAuthentictedUser, authorizeRoles("admin"), whatsAppController.updateWhatsAppNumber);

module.exports = router;
