import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
            state: true
        },

        async (accesstoken, refreshToken, profile, done) => {
            try {
                console.log("Google Strategy Callback Triggered");
                console.log("Profile ID:", profile.id);

                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    console.log("New user detected, creating account...");
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.id}@google.com`,
                        profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
                        anonymousId: `#${Math.floor(1000000 + Math.random() * 9000000)}`
                    });
                }

                console.log("User found/created:", user.email);
                return done(null, user);
            } catch (error) {
                console.error("Strategy Callback Error:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;