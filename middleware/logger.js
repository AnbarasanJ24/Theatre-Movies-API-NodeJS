
// @desc    Logging method and URL
const logger = (req, res, next) => {
    console.log(`${req.method} - ${req.protocol}://${req.hostname}${req.originalUrl}`);
    req.next();
}

module.exports = logger;