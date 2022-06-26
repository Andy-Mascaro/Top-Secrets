const { Router } = require('express');
const { Secret } = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const user = await Secret.getAll();
    res.send(user);
  } catch (e) {
    next(e);
  }
});

// .post('/', authenticate, async (req, res, next) => {
//   try {
//     const newSecret = await Secret.insert(req.body);
//     res.json(newSecret);
//   } catch (e) {
//     next(e);
//   }
// });
