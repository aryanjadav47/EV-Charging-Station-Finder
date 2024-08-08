let jwt=require("jsonwebtoken");
let secrect="aryan";

function createTokenForUser(user){
    let payLoad={
        _id : user._id,
        email : user.email,
        image : user.image,
    };

    let token=jwt.sign(payLoad,secrect);
    return token;
}

function validateToken(token){
    let payLoad=jwt.verify(token,secrect);
    return payLoad;
}

module.exports={
    createTokenForUser,
    validateToken,
}