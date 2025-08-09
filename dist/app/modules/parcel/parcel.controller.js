"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createParcel = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // const imagePaths = (req.files as Express.Multer.File[])?.map(file => file.path) || [];
    const payload = {
        ...req.body,
        sender: req.user,
        // images: imagePaths,
    };
    const result = await parcel_service_1.ParcelService.createParcel(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Parcel created successfully",
        data: result,
    });
});
const getMyParcels = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const result = await parcel_service_1.ParcelService.getMyParcels(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcels retrieved successfully",
        data: result
    });
});
const getAllParcelsForAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getAllParcelsForAdmin();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Parcels retrieved successfully",
        data: result,
    });
});
const updateParcelStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { parcelId } = req.params;
    const { status } = req.body;
    const result = await parcel_service_1.ParcelService.updateParcelStatus(req.user, parcelId, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel status updated successfully",
        data: result,
    });
});
const cancelParcel = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { parcelId } = req.params;
    const result = await parcel_service_1.ParcelService.cancelParcel(req.user, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel cancelled successfully",
        data: result,
    });
});
const confirmDelivery = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { parcelId } = req.params;
    const result = await parcel_service_1.ParcelService.confirmDelivery(req.user, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel delivery confirmed successfully",
        data: result,
    });
});
exports.ParcelController = {
    createParcel,
    getMyParcels,
    getAllParcelsForAdmin,
    updateParcelStatus,
    cancelParcel,
    confirmDelivery
};
