const { Router } = require('express');
const { Secret } = require('../models/Secret');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router().get(
  '/',
  [authenticate, authorize],
  async (req, res, next) => {
    try {
      const user = await Secret.getAll();
      res.send(user);
    } catch (e) {
      next(e);
    }
  }
);
