"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const statusLogSchema = new mongoose_1.Schema({
    status: { type: String, enum: [
            'Requested', 'Approved', 'Dispatched', 'In-Transit', 'Delivered', 'Cancelled', 'Confirmed'
        ], required: true },
    timestamp: { type: Date, default: Date.now },
    updateBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }
}, {
    versionKey: false
});
const parcelSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    requestedDeliveryDate: { type: Date, required: true },
    parcelWeight: { type: Number, required: true },
    parcelType: { type: String, required: true },
    deliveryFee: { type: Number, default: 0 },
    trackingId: { type: String },
    status: { type: String, enum: [
            'Requested', 'Approved', 'Dispatched', 'In-Transit', 'Delivered', 'Cancelled', 'Confirmed'
        ], default: 'Requested' },
    statusHistory: [statusLogSchema],
}, {
    timestamps: true,
    versionKey: false
});
parcelSchema.pre('save', function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.trackingId = `TRK-${year}${month}${day}-${randomChars}`;
        this.statusHistory.push({
            status: "Requested",
            timestamp: new Date(),
            updateBy: this.sender,
            notes: `Parcel creation request received.`
        });
    }
    next();
});
exports.Parcel = (0, mongoose_1.model)('Parcel', parcelSchema);
