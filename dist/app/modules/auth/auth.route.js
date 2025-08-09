"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
const authCheck_1 = require("../../middleware/authCheck");
const router = (0, express_1.Router)();
router.post("/login", passport_1.default.authenticate('local'), auth_controller_1.AuthControllers.credentialsLogin);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/change-password", (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IUserRole)), auth_controller_1.AuthControllers.changePassword);
router.post("/set-password", (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IUserRole)), auth_controller_1.AuthControllers.setPassword);
router.post("/forgot-password", auth_controller_1.AuthControllers.forgotPassword);
router.post("/reset-password", (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IUserRole)), auth_controller_1.AuthControllers.resetPassword);
router.get("/google", async (req, res, next) => {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res, next);
});
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team`,
}), auth_controller_1.AuthControllers.googleCallbackController);
exports.AuthRoutes = router;
