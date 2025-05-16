import { Router } from "express";
import passport from "./passport.mjs";
import session from "express-session";

const authRouter = Router()

authRouter.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

authRouter.use(passport.initialize())
authRouter.use(passport.session())

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

authRouter.get("/google/callback",
    passport.authenticate('google', { failureRedirect: '/auth/failure', successRedirect: "/auth/profile" }),
)

authRouter.get("/failure", (req, res) => {
    res.send({ message: "Auth Failed" })
})

authRouter.get("/profile", (req, res) => {
    if (!req.user) return res.status(401).send({ message: "Unathenticated" })
    res.send({ data: req.user })
})

authRouter.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/")
    })
})

export default authRouter
