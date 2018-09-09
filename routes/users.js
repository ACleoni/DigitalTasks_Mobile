const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')

router.get('/confirmation', (req, res) => usersController.confirmationGet(req, res))
      .get('/confirmation/resend', (req, res) => usersController.resendConfirmation(req, res))

module.exports = router;