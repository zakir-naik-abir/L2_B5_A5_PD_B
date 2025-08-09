"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (ZodSchema) => async (req, res, next) => {
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        ;
        req.body = await ZodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateRequest = validateRequest;
