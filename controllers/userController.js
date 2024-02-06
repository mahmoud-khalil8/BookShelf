import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async(req, res) => {
    const users=await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});
const filterObj=(obj,...allowedFields) =>{
  const newObj ={} ;
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el]=obj[el] ;
  })
  return newObj ;

}
export const updateMe =catchAsync(async(req,res,next)=>{
  if(req.body.password||req.confirmPassword){
    return next(AppError('This route is not for password updates. Please use /updateMyPassword.', 400))

  }
  const filteredBody =filterObj(req.body,'name','email');
  const updatedUser=await User.findByIdAndUpdate(req.user._id,filteredBody,{
    new:true,
    runValidators:true 
  })
    res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
})

export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
export const deleteMe =catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false})
  res.status(204).json({
    status:'success' ,
    data:null
  })
})