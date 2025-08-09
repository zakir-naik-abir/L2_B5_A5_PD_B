"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
const user_interface_1 = require("../modules/user/user.interface");
passport_1.default.use('local', new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({ email: email });
        if (!isUserExist) {
            return done("Incorrect Email");
        }
        ;
        if (!isUserExist.isVerified) {
            return done("User does not verified");
        }
        ;
        if (!isUserExist.password) {
            return done(null, false, { message: "Password is wrong" });
        }
        ;
        const isGoogleAuthenticated = isUserExist.auths.some((providerObjects) => providerObjects.provider == "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Email and then you can login with email and password.",
            });
        }
        const isPasswordMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
        console.log(isPasswordMatched);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password is wrong" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let isUserExist = await user_model_1.User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        if (isUserExist && isUserExist.isBlocked) {
            return done(null, false, { message: `User is blocked` });
        }
        if (!isUserExist) {
            isUserExist = await user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: profile.photos?.[0].value,
                role: user_interface_1.IUserRole.SENDER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google Strategy Error");
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
});
