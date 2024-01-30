import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import  jwt from 'jsonwebtoken';
import {promisify} from 'util';

import AppError from '../utils/appError.js';
const signupToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}


export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(
    {
      id:req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    }

  );

  const token = signupToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user= await User.findOne({email}).select('+password');
  // 1) Check if email and password exist
  if (!email || !password
) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  if(!user ||!(await user.correctPassword(password, user.password))){
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) If everything ok, send token to client
  const token = signupToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });


} );
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  console.log(req.headers.authorization);
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if(!token){
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, (err, decoded) => {}
  );
  console.log(decoded);

  next() ;
}
);
