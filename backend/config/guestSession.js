const GUEST_SESSION_MS = process.env.GUEST_SESSION_MINUTES * 60 * 1000;
const GUEST_COOKIE_NAME = 'guestJwt';

function getGuestCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: GUEST_SESSION_MS,
        path: '/'
    };
}

function getGuestCookieClearOptions() {
    const { maxAge, ...options } = getGuestCookieOptions();
    return options;
}

module.exports = {
    GUEST_SESSION_MS,
    GUEST_COOKIE_NAME,
    getGuestCookieOptions,
    getGuestCookieClearOptions
};
