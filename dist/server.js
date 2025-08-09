"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const app_1 = __importDefault(require("./app"));
let server;
const startServer = async () => {
    try {
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`🚚 Parcel Delivery API is running on Port: ${env_1.envVars.PORT}`);
        });
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log(`✅ Connected to MongoDB Successfully!`);
    }
    catch (error) {
        console.log(`❌ Failed to connect ${error}`);
    }
};
(async () => {
    await startServer();
})();
