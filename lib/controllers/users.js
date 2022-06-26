const { Router } = require('express');
const { UserService } = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { User } = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const sessionToken = await UserService.signIn({
        first_name,
        last_name,
        email,
        password,
      });

      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully' });
    } catch (e) {
      next(e);
    }
  })

  .get('/person', authenticate, (req, res) => {
    res.json(req.user);
  })

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const user = await User.getAll();
      res.send(user);
    } catch (e) {
      next(e);
    }
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out complete' });
  });
