"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
// create user
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });
    return user;
};
// get all users
const getAllUsers = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const userData = queryBuilder.filter();
    // .search(userSearchableFields)
    // .sort()
    // .fields()
    // .paginate();
    const [data] = await Promise.all([
        userData.build(),
        // queryBuilder.getMeta()
    ]);
    return {
        data,
    };
};
// get single user
const getSingleUser = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
};
// update user
const updateUser = async (userId, payload) => {
    const isUserExist = await user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    const newUpdateUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdateUser;
};
// get me
const getMe = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
};
const toggleBlockStatus = async (userId, isBlocked) => {
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { isBlocked: isBlocked }, { new: true });
    if (!updatedUser) {
        throw new Error('User not found');
    }
    console.log(`User with ID: ${userId} has been ${isBlocked ? 'blocked' : 'unblocked'}.`);
    const result = {
        id: userId,
        name: 'Test User',
        isBlocked: isBlocked,
    };
    return result;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    toggleBlockStatus
};
