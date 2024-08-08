let mongoose=require("mongoose");

let userSchema=new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    message:{
        type: String,
        require: true,
    },
}, { timestamps: true});

let contact=mongoose.model("contact",userSchema);

module.exports=contact;
