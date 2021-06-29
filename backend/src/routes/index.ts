import { Router } from "express";
import { resolve } from "path";

const router = Router();

router.get("*", (req, res) => {
    if((req.baseUrl + req.path) === "/login" && req.cookies.auth) return res.redirect("/home");
    res.sendFile(resolve(__dirname, "../public/index.html"));
});

export default router;