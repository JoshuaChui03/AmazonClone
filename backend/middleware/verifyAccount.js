const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Guest = require('../model/Guest');
const {
  USER_COOKIE_NAME,
  getUserCookieClearOptions
} = require('../config/userSession');
const {
  GUEST_COOKIE_NAME,
  getGuestCookieClearOptions
} = require('../config/guestSession');

const verifyAccount = async (req, res, next) => {
  const userToken = req.cookies?.[USER_COOKIE_NAME];

  // A logged-in user always takes precedence over a guest session.
  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.USER_TOKEN_SECRET);

      if (!mongoose.isValidObjectId(decoded.sub)) {
        throw new Error('Invalid user id.');
      }

      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new Error('User not found.');
      }

      req.account = user;
      req.accountType = 'user';
      return next();
    } catch (err) {
      res.clearCookie(USER_COOKIE_NAME, getUserCookieClearOptions());
      return res.status(401).json({
        code: err.name === 'TokenExpiredError' ? 'USER_EXPIRED' : 'USER_INVALID',
        message: err.name === 'TokenExpiredError'
          ? 'User session expired.'
          : 'User session invalid.'
      });
    }
  }

  const guestToken = req.cookies?.[GUEST_COOKIE_NAME];

  if (!guestToken) {
    return res.status(401).json({
      code: 'GUEST_REQUIRED',
      message: 'Guest session required.'
    });
  }

  try {
    const decoded = jwt.verify(guestToken, process.env.GUEST_TOKEN_SECRET);

    if (!mongoose.isValidObjectId(decoded.sub)) {
      throw new Error('Invalid guest id.');
    }

    const guest = await Guest.findById(decoded.sub);

    if (!guest || guest.expiresAt <= new Date()) {
      if (guest) {
        await Guest.findByIdAndDelete(guest._id);
      }

      res.clearCookie(GUEST_COOKIE_NAME, getGuestCookieClearOptions());
      return res.status(401).json({
        code: 'GUEST_EXPIRED',
        message: 'Guest session expired.'
      });
    }

    req.account = guest;
    req.accountType = 'guest';
    return next();
  } catch (err) {
    res.clearCookie(GUEST_COOKIE_NAME, getGuestCookieClearOptions());
    return res.status(401).json({
      code: err.name === 'TokenExpiredError' ? 'GUEST_EXPIRED' : 'GUEST_INVALID',
      message: err.name === 'TokenExpiredError'
        ? 'Guest session expired.'
        : 'Guest session invalid.'
    });
  }
};

module.exports = verifyAccount;
