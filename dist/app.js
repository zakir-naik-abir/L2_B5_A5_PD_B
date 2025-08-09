"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./app/config/env");
const notFound_1 = require("./app/middleware/notFound");
const routes_1 = require("./app/routes");
require("./app/config/passport");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "*",
    exposedHeaders: ['Authorization']
};
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use("/api/v1", routes_1.router);
app.get('/', (req, res) => {
    res.status(200).json({
        message: "🚚 Welcome to Parcel Delivery System Backend"
    });
});
app.use(notFound_1.notFound);
exports.default = app;
