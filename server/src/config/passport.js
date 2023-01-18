import passport from 'passport';
import google from 'passport-google-oauth20'
import facebook from 'passport-facebook'

const configPassport = () => {

    // Google
    const GoogleStrategy = google.Strategy;

    passport.use(new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID_GOOGLE,
            clientSecret: process.env.CLIENT_SECRET_GOOGLE,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        function (accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    ))

    // Facebook
    const FakebookStrategy = facebook.Strategy;

    passport.use(new FakebookStrategy(
        {
            clientID: process.env.CLIENT_ID_FACEBOOK,
            clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id','displayName','picture','email']
        },
        function (accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

}

export default configPassport