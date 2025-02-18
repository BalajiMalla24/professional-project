//custom api error handling
class Apierror extends Error{
   
    constructor(stack ="" , statusCode , errors=[] , message="something went wrong"){
            super(message);
            this.statusCode = statusCode
            this.data =null
            this.message = message
            this.success = false
            this.errors =errors

            if (stack) {
                this.stack = stack
            } else{
                Error.captureStackTrace(this, this.constructor)
            }
          
    }
}
export {Apierror};