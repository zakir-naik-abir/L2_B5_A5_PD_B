"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .trim()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string()
        // .toLowerCase()
        .email({ message: "Invalid email address" })
        .endsWith("@gmail.com", { message: "Enter your valid email" })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters" })
        .refine((email) => email === email.toLowerCase(), { message: "Email must be lowercase" })
        .regex(/^(?!\.)(?!.*\.\.)([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, {
        message: "Enter your valid email"
    }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .regex(/^(?=.*)/, {
        message: "Password must contain as least 1 number.",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
});
exports.updateZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .trim()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.IUserRole))
        .optional(),
    isVerified: zod_1.default
        .boolean()
        .optional(),
    isBlocked: zod_1.default
        .boolean()
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
});
