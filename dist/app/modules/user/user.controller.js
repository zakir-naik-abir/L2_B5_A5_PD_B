"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
// create user
const createUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userData = req.body;
    console.log('Request Body in Controller:', userData);
    const user = await user_service_1.UserServices.createUser(userData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});
// get all user
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const query = req.body;
    const result = await user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        // meta: result.meta
    });
});
// get single user 
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const result = await user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Retrieved Successfully",
        data: result.data,
    });
});
// update user 
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.params.id;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Update Successfully",
        data: user,
    });
});
// get me
const getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req?.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your Profile Retrieved Successfully",
        data: result.data,
    });
});
const blockUser = async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.toggleBlockStatus(id, true);
    res.status(200).json({ success: true, message: 'User blocked successfully', data: result });
};
const unblockUser = async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.toggleBlockStatus(id, false);
    res.status(200).json({ success: true, message: 'User unblocked successfully', data: result });
};
exports.UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    blockUser,
    unblockUser
};
