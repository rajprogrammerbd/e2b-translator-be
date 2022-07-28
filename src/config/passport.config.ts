const passport = require("passport");
import Database from "./db.config";
import userSchema from "./schema/user";

const User = Database.prepare(userSchema, 'user');

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JSON_PRIVATE_KEY,

passport.use(new JwtStrategy(opts, (jwt_payload: any, done: any) => {
    User.findOne({ id: jwt_payload.sub }, function(err: any, user: any) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));

