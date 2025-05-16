import passport from "passport";
import db from "../../lib/db.mjs";
import googleStrategy from "./googleAuthStrategy.mjs";

passport.use(googleStrategy)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.user.findUnique({ where: { id } })
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

export default passport
