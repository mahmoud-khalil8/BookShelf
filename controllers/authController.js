import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import  jwt from 'jsonwebtoken';
import {promisify} from 'util';
import sendEmail from '../utils/mail.js';

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
      role: req.body.role,
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
  //console.log(req.headers.authorization);
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  //console.log(token);
  if(!token){
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, (err, decoded) => {}
  );

  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if(!currentUser){
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  if(currentUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // 4) Check if user changed password after the token was issued
  req.user = currentUser;



  next() ;
}
);
export const restrictTo = (roles) => {
  return (req, res, next) => {
    console.log(req.user.role);

    if(!roles.includes(req.user.role)){
      //403 forbidden
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next() ;
  }

}
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({email: req.body.email});
  if(!user){
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  //console.log(resetToken);
  await user.save({validateBeforeSave: false});
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
}
);



export const resetPassword = catchAsync(async (req, res, next) => {});