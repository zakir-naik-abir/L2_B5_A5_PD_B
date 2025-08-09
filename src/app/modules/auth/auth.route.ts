import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";
import { envVars } from "../../config/env";
import { IUserRole } from "../user/user.interface";
import { authCheck } from "../../middleware/authCheck";

const router = Router();

router.post("/login", passport.authenticate('local'), AuthControllers.credentialsLogin);

router.post("/logout", AuthControllers.logout);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

router.post(
  "/change-password",
  authCheck(...Object.values(IUserRole)),
  AuthControllers.changePassword
);
router.post(
  "/set-password",
  authCheck(...Object.values(IUserRole)),
  AuthControllers.setPassword
);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post(
  "/reset-password",
  authCheck(...Object.values(IUserRole)),
  AuthControllers.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
