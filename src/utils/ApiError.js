class ApiError extends Error {
constructor(statusCode,message="Something went wrong in APIError",errors=[],stack=""){
super(message); //calls constructor of parent class ie.Error witj updated message
this.statusCode=statusCode;
this.data=null
this.message=message;
this.success=false;
this.errors=errors;

// The stack property is a string describing the point in the code at which the Error was instantiated.
if(stack){
    this.stack=stack;
}
else{
    //Captures a stack trace for the current error object and removes internal constructor frames from the trace and makes it easier to debug showing only relevant code where error was instantiated.
    Error.captureStackTrace(this,this.constructor);
}
}
}

export {ApiError};