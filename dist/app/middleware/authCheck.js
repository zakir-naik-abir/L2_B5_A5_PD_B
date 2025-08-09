"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../error/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const authCheck = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Received");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const { role, userId } = verifiedToken;
        // const isUserExist = await User.findOne({ email: verifiedToken.email });
        const isUserExist = await user_model_1.User.findById(userId);
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (!isUserExist.isVerified) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
        }
        if (isUserExist.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is blocked");
        }
        // if (!authRoles.includes(verifiedToken.role)) {
        //   throw new AppError(401, "You are not permitted to view this route!!");
        // }
        if (!authRoles.includes(isUserExist.role)) {
            throw new AppError_1.default(401, "You are not permitted this route");
        }
        req.user = isUserExist;
        // req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
};
exports.authCheck = authCheck;
