import { Strategy as GoogleStrategy } from "passport-google-oauth20"; import db from "../../lib/db.mjs";

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await db.user.findUnique({
                where: { googleId: profile.id }
            })

            if (!user) {
                user = await db.user.create({
                    data: {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        profile_picture: profile.photos[0].value
                    }
                })
            }
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    }
)

export default googleStrategy
