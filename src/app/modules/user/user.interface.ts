import { Types } from 'mongoose';

export enum IUserRole {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver"
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
};

export interface IUser {
  _id?: Types.ObjectId
  name: string
  email: string
  password?: string
  phone?: string
  picture?: string
  address?: string
  isBlocked?: string
  isVerified?: boolean
  role: IUserRole
  auths: IAuthProvider[]
  createdAt?: Date
};