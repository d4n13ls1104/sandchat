const jwt = require("../util/sand-jwt");

const whitelisted_paths = ["/", "/login", "/register"];

const auth = (req, res, next) => {
    if(!whitelisted_paths.includes(req.baseUrl + req.path)) {
        if(!req.cookies.auth || !jwt.verify(req.cookies.auth)) {
            res.clearCookie("auth");
            return res.redirect("/login");
        }
    }
    next();
}

module.exports = auth;
