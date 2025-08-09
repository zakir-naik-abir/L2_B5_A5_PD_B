"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const env_1 = require("../../config/env");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.IUserRole),
        required: true,
        default: user_interface_1.IUserRole.SENDER
    },
    phone: { type: String, required: true },
    picture: { type: String },
    address: { type: String },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    auths: [authProviderSchema],
}, {
    versionKey: false,
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') && this.password) {
        this.password = await bcryptjs_1.default.hash(this.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    next();
});
userSchema.statics.isUserExists = async function (email) {
    return await this.findOne({ email }).select('+password');
};
exports.User = (0, mongoose_1.model)("User", userSchema);
