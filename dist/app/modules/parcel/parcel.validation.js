"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.parcelValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        receiverName: zod_1.default.string(),
        receiverPhone: zod_1.default.string(),
        deliveryAddress: zod_1.default.string(),
        requestedDeliveryDate: zod_1.default.string().transform((str) => new Date(str)),
        parcelWeight: zod_1.default.number(),
        parcelType: zod_1.default.string(),
        deliveryFee: zod_1.default.number().optional(),
    }),
});
