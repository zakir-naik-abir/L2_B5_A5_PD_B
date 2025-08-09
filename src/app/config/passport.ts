import bcryptjs from 'bcryptjs';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { User } from "../modules/user/user.model";
import { envVars } from "./env";
import { IUserRole } from "../modules/user/user.interface";

passport.use('local',
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email: email });

        if (!isUserExist) {
          return done("Incorrect Email");
        };
        if (!isUserExist.isVerified) {
          return done("User does not verified");
        };
        if(!isUserExist.password){
          return done(null, false, { message: "Password is wrong"})
        };
        
      
      
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Email and then you can login with email and password.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password,
          isUserExist.password
        );
        console.log(isPasswordMatched)

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password is wrong" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }
        
        
        if (isUserExist && isUserExist.isBlocked) {
          return done(null, false, { message: `User is blocked` });
        }
        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: IUserRole.SENDER,
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
      } catch (error) {
        console.log("Google Strategy Error");
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
