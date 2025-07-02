import { Router } from "express";
import authRouter from "./auth/router.mjs";
import userRouter from "./user/router.mjs";
import session from "express-session";
import passport from "./auth/passport.mjs";

const router = Router()

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,        // harus true kalo pakai https
        sameSite: 'None',    // harus None kalo cross-origin
        maxAge: 1000 * 60 * 60 * 24 // 1 hari
    }
}))

router.use(passport.initialize())
router.use(passport.session())

router.use("/auth", authRouter)
router.use("/user", userRouter)

router.get("/test", (req, res) => {
    console.log(req.isAuthenticated(), req.user);
    res.send({
        message: "test"
    })
})

export default router
