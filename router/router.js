let express=require("express");
let {checkAuth}=require("../middleware/middle");
let router=express.Router();
let user=require("../model/model");
let contact=require("../model/contact");
let multer=require("multer");


let storage=multer.diskStorage({
    destination : function(req,file,cb){
        return cb(null,"./uploads");
    },
    filename : function(req,file,cb){
        return cd(null,`${Date.now()}-${file.originalname}`);
    },
}); 

let upload=multer({storage});

router.get("/", (req,res)=>{

        res.render('home', { user: req.user,  });
   
});

router.get("/login",async (req,res)=>{
    return res.render("login");
});

router.get("/add",async (req,res)=>{
    return res.render("add");
});

router.post("/add",upload.single("image"),async (req,res)=>{
    try{
    let {name,email,password}=req.body;
    await user.create({
        name,
        email,
        password,
    });
    return res.redirect("/finder");
}catch(err){
    res.send(err);
}
});

router.post("/login",async (req,res)=>{
    try{
    let {email,password}=req.body;
    let token=await user.matchPasswordAndToken(email,password);
    if(!token) {
        alert("inccorect password");
    }
    else{
    return res.cookie("token", token).redirect('/finder');
    }
}
catch(err){
    res.send(err);
}
});

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
});

router.post("/",async (req,res)=>{
    try{
    let {name, email, message}=req.body;
    await contact.create({
        name,
        email,
        message,
    });

    return res.redirect("/");
}catch(err){
    res.send(err);s
}
});



module.exports=router;