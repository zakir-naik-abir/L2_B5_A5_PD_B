import { Types } from "mongoose";

export type IParcelStatus = "Requested" | "Approved" | "Dispatched" | "In-Transit" | "Delivered" | "Cancelled" | "Confirmed";

export type IStatusLog = {
  status: IParcelStatus;
  timestamp: Date;
  updateBy: Types.ObjectId;
  notes?: string;
};

export type IParcel = {
   sender: Types.ObjectId;
   receiverName: string;
   receiverPhone: string;
   receiverAddress: string;
   deliveryAddress: string;
   requestedDeliveryDate: Date;
   parcelWeight: number;
   parcelType: string;
   deliveryFee: number;
   trackingId: string;
   status: IParcelStatus;
   statusHistory: IStatusLog[];
};