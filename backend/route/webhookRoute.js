const express = require("express");
const { stripeWebhook } = require("../controller/webhookController");
const router = express.Router();

router.post("/webhook", stripeWebhook);

module.exports = router;
