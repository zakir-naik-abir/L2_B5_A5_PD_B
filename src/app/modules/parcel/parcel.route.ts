import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { authCheck } from "../../middleware/authCheck";
import { IUserRole } from "../user/user.interface";

const router = Router();

// router.post('/create', ParcelController.createParcel)

router.post(
  '/create',
  authCheck(IUserRole.SENDER),
  // validateRequest(createParcelValidationSchema),
  ParcelController.createParcel
);

router.get('/my-parcels', authCheck(IUserRole.ADMIN, IUserRole.SENDER, IUserRole.RECEIVER), ParcelController.getMyParcels);

router.get('/all-parcel', authCheck(IUserRole.ADMIN), ParcelController.getAllParcelsForAdmin)

router.patch('/cancel/:parcelId', authCheck(IUserRole.SENDER), ParcelController.cancelParcel);

router.patch('/confirm/:parcelId', authCheck(IUserRole.RECEIVER), ParcelController.cancelParcel);

router.patch('/update-status/:parcelId', authCheck(IUserRole.ADMIN),
//  validateRequest(parcelValidationSchema.updateStatusValidationSchema), 
ParcelController.updateParcelStatus)

export const ParcelRoutes = router;