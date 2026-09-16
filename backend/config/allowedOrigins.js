const allowedOrigins =
    process.env.FRONTEND_ORIGINS
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) || [];

module.exports = allowedOrigins;
