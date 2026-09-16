const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Guest = require('../model/Guest');
const {
  GUEST_COOKIE_NAME,
  getGuestCookieClearOptions
} = require('../config/guestSession');

const verifyGuest = async (req, res, next) => {
  const guestToken = req.cookies?.[GUEST_COOKIE_NAME];

  if (!guestToken) {
    return res.status(401).json({
      code: 'GUEST_REQUIRED',
      message: 'Guest session required.'
    });
  }

  try {
    const decoded = jwt.verify(
        guestToken,
        process.env.GUEST_TOKEN_SECRET
    );

    const guestId = decoded.sub;

    if (!mongoose.isValidObjectId(guestId)) {
      res.clearCookie(GUEST_COOKIE_NAME, getGuestCookieClearOptions());
      return res.status(401).json({
        code: 'GUEST_INVALID',
        message: 'Guest session invalid.'
      });
    }

    const guest = await Guest.findById(guestId);

    if (!guest || guest.expiresAt <= new Date()) {
      if (guest) {
        await Guest.findByIdAndDelete(guest._id);
      }

      res.clearCookie(GUEST_COOKIE_NAME, getGuestCookieClearOptions());
      return res.status(401).json({ code: 'GUEST_EXPIRED', message: 'Guest session expired.' });
    }

    req.guest = guest;
    next();
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

module.exports = verifyGuest;
