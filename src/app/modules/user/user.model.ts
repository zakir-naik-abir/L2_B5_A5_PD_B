import bcryptjs from 'bcryptjs';
import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, IUserRole } from "./user.interface";
import { envVars } from "../../config/env";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
 role: { 
    type: String,
    enum: Object.values(IUserRole),
    required: true,
    default: IUserRole.SENDER
  },
  phone: { type: String, required: true },
  picture: { type: String },
  address: { type: String },
  isBlocked: { type: Boolean, default: false},
  isVerified: { type: Boolean, default: true },
  auths: [authProviderSchema],
}, {
  versionKey: false,
  timestamps: true
});


userSchema.pre('save', async function (next) {
  if(!this.isModified('password') && this.password){
    this.password = await bcryptjs.hash(
      this.password, Number(envVars.BCRYPT_SALT_ROUND),
    );
  }
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

export const User = model<IUser>("User", userSchema);