class CustomError extends Error{
    constructor(message,statusCode){
        //Clling base class constructor
        super(message);
        //Changing status code
        this.statusCode = this.statusCode;
        //Assigning the status
        this.status = statusCode > 400 && statusCode<=500 ? 'fail' : 'error';
        //Selecting only operational errors
        this.isOperational = true;
        //Stack trace 
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = CustomError;