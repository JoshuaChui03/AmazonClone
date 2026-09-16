const USER_COOKIE_NAME = process.env.USER_COOKIE_NAME || 'userJwt';
const USER_SESSION_HOURS = Number(process.env.USER_SESSION_HOURS || 24);
const USER_SESSION_MS = USER_SESSION_HOURS * 60 * 60 * 1000;

function getUserCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: USER_SESSION_MS,
    path: '/'
  };
}

function getUserCookieClearOptions() {
  const { maxAge, ...options } = getUserCookieOptions();
  return options;
}

module.exports = {
  USER_COOKIE_NAME,
  USER_SESSION_HOURS,
  USER_SESSION_MS,
  getUserCookieOptions,
  getUserCookieClearOptions
};
