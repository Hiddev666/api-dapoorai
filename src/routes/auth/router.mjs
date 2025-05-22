import { Router } from "express";
import passport from "./passport.mjs";

const authRouter = Router()
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/failure",
        session: true,
    }),
    (req, res) => {
        // redirect to frontend with user info or token
        res.redirect(`${FRONTEND_BASE_URL}/user`);
        // res.redirect(`/user`);
    }
);

authRouter.get("/failure", (req, res) => {
    res.send({ message: "Auth Failed" })
})

authRouter.get("/profile", (req, res) => {
    console.log(req.isAuthenticated())
    if (!req.user) return res.status(401).send({ message: "Unathenticated" })
    res.send({ data: req.user })
})

authRouter.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect(`${FRONTEND_BASE_URL}/auth/login`)
    })
})

export default authRouter
