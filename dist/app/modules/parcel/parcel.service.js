"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_model_1 = require("./parcel.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createParcel = async (payload) => {
    payload.deliveryFee = (payload.parcelWeight || 0) * 50;
    const result = await parcel_model_1.Parcel.create(payload);
    return result;
};
const getMyParcels = async (user) => {
    const userRole = user.role?.toLowerCase();
    const userId = user._id;
    if (!userRole || !userId) {
        console.error('Error: Role or ID not found in user model instance.');
        return [];
    }
    if (userRole === 'sender') {
        console.log(`Searching for parcels with sender ID: ${userId}`);
        const parcels = await parcel_model_1.Parcel.find({ sender: userId });
        console.log(`Parcels found for sender: ${parcels.length}`);
        return parcels;
    }
    if (userRole === 'receiver') {
        const receiverPhone = user.phone;
        if (!receiverPhone) {
            console.log('Receiver has no phone number in their profile.');
            return [];
        }
        console.log(`Searching for parcels with receiver phone: ${receiverPhone}`);
        const parcels = await parcel_model_1.Parcel.find({ receiverPhone: receiverPhone }).populate('sender', 'name email');
        console.log(`Parcels found for receiver: ${parcels.length}`);
        return parcels;
    }
    return [];
};
const getAllParcelsForAdmin = async () => {
    return await parcel_model_1.Parcel.find().populate('sender', 'name email');
};
const updateParcelStatus = async (user, parcelId, status) => {
    const parcel = await parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    parcel.status = status;
    parcel.statusHistory.push({
        status: status,
        timestamp: new Date(),
        updateBy: user.userId,
        notes: `Status updated to ${status} by admin`
    });
    await parcel.save();
    return parcel;
};
const cancelParcel = async (user, parcelId) => {
    const parcel = await parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.sender.toString() !== user.userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized to cancel this parcel');
    }
    if (parcel.status === 'Dispatched' || parcel.status === 'Delivered') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel a parcel that is already ${parcel.status})`);
    }
    parcel.status = 'Cancelled';
    parcel.statusHistory.push({
        status: 'Cancelled',
        timestamp: new Date(),
        updateBy: user.userId,
        notes: 'Parcel cancelled by sender'
    });
    await parcel.save();
    return parcel;
};
const confirmDelivery = async (user, parcelId) => {
    const parcel = await parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    const receiverUser = await user_model_1.User.findById(user);
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver not found');
    }
    console.log(parcel.receiverPhone);
    console.log(receiverUser.phone);
    if (parcel.receiverPhone !== receiverUser.phone) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not the intended receiver of this parcel');
    }
    if (parcel.status !== 'Delivered') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'parcel is not marked as delivered yet');
    }
    parcel.status = 'Confirmed';
    parcel.statusHistory.push({
        status: 'Confirmed',
        timestamp: new Date(),
        updateBy: user.userId,
        notes: 'Delivery confirmed by receiver'
    });
    await parcel.save();
    return parcel;
};
exports.ParcelService = {
    createParcel,
    getMyParcels,
    getAllParcelsForAdmin,
    updateParcelStatus,
    cancelParcel,
    confirmDelivery
};
