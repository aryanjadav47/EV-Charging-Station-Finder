let {validateToken}=require("../servies/auth");

function checkAuth(cookieName){
    return (req,res,next)=>{
        let tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }

        try{
            let userPayLoad=validateToken(tokenCookieValue);
            req.user=userPayLoad;
        } catch(err){}

        return next();
    };
}

module.exports={
    checkAuth,
}