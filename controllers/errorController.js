const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
}
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,

        });
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

}
export const globalErrorController= (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.Node_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.Node_ENV === 'production') {
        const error={...err};
        error.message=err.message;
        if(error.name==='CastError') error=new AppError(`Invalid ${error.path}: ${error.value}.`,400);
        if(error.code===11000) error=new AppError(`Duplicate field value: ${error.keyValue.name}. Please use another value!`,400);
        if(error.name==='ValidationError') error=new AppError(`${error.message}`,400);
        if(error.name==='JsonWebTokenError') error=new AppError(`Invalid token. Please log in again!`,401);
        if(error.name==='TokenExpiredError') error=new AppError(`Your token has expired! Please log in again.`,401);

        
        sendErrorProd(err, res);
    }

}