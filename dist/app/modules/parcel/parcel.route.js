"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const parcel_controller_1 = require("./parcel.controller");
const authCheck_1 = require("../../middleware/authCheck");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// router.post('/create', ParcelController.createParcel)
router.post('/create', (0, authCheck_1.authCheck)(user_interface_1.IUserRole.SENDER), 
// validateRequest(createParcelValidationSchema),
parcel_controller_1.ParcelController.createParcel);
router.get('/my-parcels', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IUserRole)), parcel_controller_1.ParcelController.getMyParcels);
// router.get('/my-parcels', authCheck(IUserRole.ADMIN, IUserRole.SENDER, IUserRole.RECEIVER), ParcelController.getMyParcels);
router.get('/all-parcel', (0, authCheck_1.authCheck)(user_interface_1.IUserRole.ADMIN), parcel_controller_1.ParcelController.getAllParcelsForAdmin);
router.patch('/cancel/:parcelId', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IUserRole)), parcel_controller_1.ParcelController.cancelParcel);
router.patch('/confirm/:parcelId', (0, authCheck_1.authCheck)(user_interface_1.IUserRole.RECEIVER), parcel_controller_1.ParcelController.confirmDelivery);
router.patch('/update-status/:parcelId', (0, authCheck_1.authCheck)(user_interface_1.IUserRole.ADMIN), parcel_controller_1.ParcelController.updateParcelStatus);
exports.ParcelRoutes = router;
