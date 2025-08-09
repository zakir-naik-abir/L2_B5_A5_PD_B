"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.deleteImageFromCloudinary = exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const stream_1 = __importDefault(require("stream"));
const AppError_1 = __importDefault(require("../error/AppError"));
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY.CLOUDINARY_SECRET,
});
const uploadBufferToCloudinary = async (buffer, fileName) => {
    try {
        return new Promise((resolve, rejects) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf"
            }, (error, result) => {
                if (error) {
                    return rejects(error);
                }
                resolve(result);
            }).end(buffer);
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(401, `Error uploading file ${error.message}`);
    }
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const deleteImageFromCloudinary = async (url) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        console.log((match));
    }
    catch (error) {
        throw new AppError_1.default(401, `Cloudinary image deletion failed ${error.message}`);
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
