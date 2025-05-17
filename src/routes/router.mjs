import { Router } from "express";
import authRouter from "./auth/router.mjs";
import session from "express-session";
import passport from "./auth/passport.mjs";

const router = Router()

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

router.use(passport.initialize())
router.use(passport.session())

router.use("/auth", authRouter)

router.get("/test", (req, res) => {
    console.log(req.isAuthenticated(), req.user);
    res.send({
        message: "test"
    })
})

export default router
