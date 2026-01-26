const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');
const { validateToken } = require('../middlewares/auth');

router.post('/create-checkout-session', validateToken, paymentsController.createCheckoutSession);

router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.handleWebhook);

module.exports = router;
