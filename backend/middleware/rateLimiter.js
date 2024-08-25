const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    max: 10,
    windowMs: 17000,
    message: "You can't make any more request at the moment. Try again later."
})

module.exports = limiter