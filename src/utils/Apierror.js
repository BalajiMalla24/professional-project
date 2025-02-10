//custom api error handling
class Apierror extends Error{
    // constructor(statusCode , message="something went wrong" , errors=[] , stack=""){
    //     super(message);
    //     this.statusCode = statusCode
    //     this.errors = errors
    //     this.message = message
    //     this.data = null
    //     this.success = false
    // }\
    constructor(stack ="" , statuscode , errors=[] , message="something went wrong"){
            this.statuscode = statuscode
            this.data =null
            this.success = false
            this.errors =errors
            super(message)
    }
}