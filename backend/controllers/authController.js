const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {
  USER_COOKIE_NAME,
  USER_SESSION_HOURS,
  USER_SESSION_MS,
  getUserCookieOptions,
  getUserCookieClearOptions
} = require('../config/userSession');
const {
  GUEST_COOKIE_NAME,
  GUEST_SESSION_MINUTES,
  getGuestCookieClearOptions
} = require('../config/guestSession');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required.'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const userToken = jwt.sign(
      { type: 'user' },
      process.env.USER_TOKEN_SECRET,
      {
        subject: user._id.toString(),
        expiresIn: Math.floor(USER_SESSION_MS / 1000)
      }
    );

    res.cookie(USER_COOKIE_NAME, userToken, getUserCookieOptions());

    // The persistent user is now the active account. Any old guest document
    // will be removed naturally by its TTL index.
    res.clearCookie(GUEST_COOKIE_NAME, getGuestCookieClearOptions());

    res.json({
      user: {
        id: user._id,
        username: user.username,
        isDemo: user.isDemo
      },
      sessionDurationHours: USER_SESSION_HOURS
    });
  } catch (err) {
    next(err);
  }
};

const getSession = (req, res) => {
  if (req.accountType === 'user') {
    return res.json({
      type: 'user',
      account: {
        id: req.account._id,
        username: req.account.username,
        isDemo: req.account.isDemo
      },
      sessionDurationHours: USER_SESSION_HOURS
    });
  }

  return res.json({
    type: 'guest',
    account: {
      _id: req.account._id,
      username: req.account.username,
      expiresAt: req.account.expiresAt
    },
    sessionDurationMinutes: GUEST_SESSION_MINUTES
  });
};

const logout = (req, res) => {
  res.clearCookie(USER_COOKIE_NAME, getUserCookieClearOptions());
  res.sendStatus(204);
};

module.exports = {
  login,
  getSession,
  logout
};
