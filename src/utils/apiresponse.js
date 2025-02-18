class apiresponse{
    constructor(statuscodes , message="success" , data){
        this.data = data
        this.message =message 
        this.statuscodes = statuscodes
        this.success =statuscodes < 400
    }
}

export {apiresponse}