const { randomBytes, createHmac } = require("crypto");
let mongoose=require("mongoose");
let {createTokenForUser}=require("../servies/auth");

let userSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true["name not found"],
    },
    email:{
        type:String,
        required: true["email not found"],
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required: true["password not found"],
    },
    image:{
        type:String,
    },
},{timestamps : true});

userSchema.pre("save", function(next){
    let user=this;

    if(!user.isModified("password")) return;
    
    let salt=randomBytes(16).toString();
    let hashPassword=createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashPassword;

    next();
});

userSchema.static("matchPasswordAndToken",async function(email,password){
    let user=await this.findOne({email});
    if(!user) throw new Error("user not found");

    let salt=user.salt;
    let hashPassword=user.password;

    let userProvidePassword=createHmac("sha256",salt).update(password).digest("hex");

    if(hashPassword!==userProvidePassword) throw new Error("incorrect password");

    let token=createTokenForUser(user);
    return token;
});

let user=mongoose.model("url",userSchema);

module.exports=user;