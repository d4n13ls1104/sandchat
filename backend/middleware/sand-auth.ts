import { verify } from "../util/sand-jwt";

const whitelisted_paths = [
    "/",
    "/login",
    "/register"
];

const auth = (req: any, res: any, next: any) => {
    if(!whitelisted_paths.includes(req.baseUrl + req.path)) {
        if(!req.cookies.auth || !verify(req.cookies.auth)) {
            res.clearCookie("auth");
            return res.redirect("/login");
        }
    }
    next();
}

export default auth;
