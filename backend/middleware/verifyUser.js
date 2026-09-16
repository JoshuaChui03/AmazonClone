const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {
  USER_COOKIE_NAME,
  getUserCookieClearOptions
} = require('../config/userSession');

const verifyUser = async (req, res, next) => {
  const userToken = req.cookies?.[USER_COOKIE_NAME];

  if (!userToken) {
    return res.status(401).json({
      code: 'USER_REQUIRED',
      message: 'User login required.'
    });
  }

  try {
    const decoded = jwt.verify(userToken, process.env.USER_TOKEN_SECRET);
    const userId = decoded.sub;

    if (!mongoose.isValidObjectId(userId)) {
      res.clearCookie(USER_COOKIE_NAME, getUserCookieClearOptions());
      return res.status(401).json({
        code: 'USER_INVALID',
        message: 'User session invalid.'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.clearCookie(USER_COOKIE_NAME, getUserCookieClearOptions());
      return res.status(401).json({
        code: 'USER_INVALID',
        message: 'User session invalid.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.clearCookie(USER_COOKIE_NAME, getUserCookieClearOptions());
    return res.status(401).json({
      code: err.name === 'TokenExpiredError' ? 'USER_EXPIRED' : 'USER_INVALID',
      message: err.name === 'TokenExpiredError'
        ? 'User session expired.'
        : 'User session invalid.'
    });
  }
};

module.exports = verifyUser;
