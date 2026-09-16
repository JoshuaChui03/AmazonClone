const jwt = require('jsonwebtoken');
const Guest = require('../model/Guest');
const Order = require('../model/Order');
const {
    GUEST_SESSION_MS,
    GUEST_COOKIE_NAME,
    getGuestCookieOptions,
    getGuestCookieClearOptions
} = require('../config/guestSession');

const createGuest = async (req, res, next) => {
    try {
        const expiresAt = new Date(Date.now() + GUEST_SESSION_MS);

        // Mongoose assigns _id as soon as the document is created in memory,
        // before it is saved. We use that same MongoDB id everywhere.
        const guest = new Guest({
            username: 'Guest',
            expiresAt,
            cart: []
        });

        guest.username = `Guest-${guest._id.toString().slice(-6).toUpperCase()}`;
        await guest.save();

        const guestToken = jwt.sign(
            {},
            process.env.GUEST_TOKEN_SECRET,
            {
                subject: guest._id.toString(),
                expiresIn: Math.floor(GUEST_SESSION_MS / 1000)
            }
        );

        res.cookie(
            GUEST_COOKIE_NAME,
            guestToken,
            getGuestCookieOptions()
        );

        res.status(201).json({
            guest: {
                _id: guest._id,
                username: guest.username,
                expiresAt: guest.expiresAt
            },

            sessionDurationMinutes: GUEST_SESSION_MS / (60 * 1000)
        });
    } catch (err) {
        next(err);
    }
};

const getGuest = async (req, res) => {
    res.json({
        guest: {
            _id: req.guest._id,
            username: req.guest.username,
            expiresAt: req.guest.expiresAt
        },
        sessionDurationMinutes: GUEST_SESSION_MS / (60 * 1000)
    });
};

const deleteGuest = async (req, res, next) => {
    try {
        await Order.deleteMany({ guestId: req.guest._id });
        await Guest.findByIdAndDelete(req.guest._id);

        res.clearCookie(
            GUEST_COOKIE_NAME,
            getGuestCookieClearOptions()
        );

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createGuest,
    getGuest,
    deleteGuest
};
