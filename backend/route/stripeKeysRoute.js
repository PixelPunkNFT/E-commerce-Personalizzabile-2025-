const express = require('express');
const { saveStripeKeys, getStripeKeys } = require('../controller/stripeKeysController');
const { isAuthentictedUser, authorizeRoles } = require('../middleWare/auth');

const router = express.Router();

router.route('/admin/stripe-keys')
    .post(isAuthentictedUser, authorizeRoles('admin'), saveStripeKeys)
    .get(isAuthentictedUser, authorizeRoles('admin'), getStripeKeys);

module.exports = router;
