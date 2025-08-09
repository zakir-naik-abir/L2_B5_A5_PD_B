import httpStatus from "http-status-codes";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";
import AppError from "../../error/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";


// create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};


// get all users
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const userData = queryBuilder.filter();
  // .search(userSearchableFields)
  // .sort()
  // .fields()
  // .paginate();

  const [data] = await Promise.all([
    userData.build(),
    // queryBuilder.getMeta()
  ]);

  return {
    data,
  };
};

// get single user
const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

// update user
const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

// get me
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  return {
    data: user,
  };
};

const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
 
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: isBlocked },
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  console.log(`User with ID: ${userId} has been ${isBlocked ? 'blocked' : 'unblocked'}.`);
  const result = {
    id: userId,
    name: 'Test User',
    isBlocked: isBlocked,
  };
  return result;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  toggleBlockStatus
};
