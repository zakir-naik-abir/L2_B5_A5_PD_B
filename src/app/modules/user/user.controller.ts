import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';


// create user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const userData = req.body
  console.log('Request Body in Controller:', userData); 
  const user = await UserServices.createUser(userData)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  })
});

// get all user
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const query = req.body;
  const result = await UserServices.getAllUsers(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    // meta: result.meta
  })
});

// get single user 
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);

   sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
   })
});

// update user 
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const userId = req.params.id;

  const payload = req.body;

  const user = await UserServices.updateUser(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Update Successfully",
    data: user,
   });
});

// get me
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const decodedToken = req?.user as JwtPayload;
  const result = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrieved Successfully",
    data: result.data,
   });
});

const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleBlockStatus(id, true);
  res.status(200).json({ success: true, message: 'User blocked successfully', data: result });
};

const unblockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleBlockStatus(id, false);
  res.status(200).json({ success: true, message: 'User unblocked successfully', data: result });
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  blockUser,
  unblockUser
};