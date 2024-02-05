import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'A user must have an id'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        maxlength: [
            40,
            'A user name must have less or equal than 40 characters',
        ],
        minlength: [
            10, 
            'A user name must have more or equal than 10 characters',
        ],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum:['user','admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [8, 'A user password must have more or equal than 8 characters'],
        trim: true,
        select: false,
        
    },
    confirmPassword: {
        type: String,
        required: [true, 'A user must have a password confirm'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: {
        type: Date,
    },
    avatar: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

});     
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hashSync(this.password, 12);
    this.confirmPassword = undefined;
    next();
})
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimestamp;
    }
    return false;
}
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000;
    //console.log({resetToken});
    return resetToken;
}


const User= mongoose.model('User', userSchema);

export default User;
