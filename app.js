require('dotenv').config();
let express=require("express");
let mongoose=require("mongoose");
let app=express();
let PORT=process.env.PORT || 8900
let path=require("path");
let userRouter=require("./router/router");
let {checkAuth}=require("./middleware/middle");
let cookieParser=require("cookie-parser");
const bodyParser = require('body-parser');
const State = require('./model/state');
const City = require('./model/city');
const Blog = require('./model/blog');
let user=require("./model/model");
let multer =require("multer");

const uri = process.env.MONGODB_URI;

let storage= multer.diskStorage({
    destination : function(req,file,cb){
        return cb(null, "uploads/");
    },
    filename : function(req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  let upload=multer({ storage : storage });


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static('public'));
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(checkAuth("token"));


app.set("view engine","ejs");
app.set("views",path.resolve("./view"));

app.use("/user",userRouter);
app.use("/contact",userRouter);
app.get("/",userRouter);
app.get("/login",userRouter);
app.get("/add",userRouter);
app.get("/logout",userRouter);


app.get("/finder", async (req,res)=>{
    try {
        const states = await State.find();
        res.render('finder', { states, user:req.user });
      } catch (err) {
        res.status(500).send('Error retrieving states.');
      }
});

app.get('/add-details', (req, res) => {
    res.render('addDetails');
  });

  app.post('/add-details',upload.single('cityImage'), async (req, res) => {
    try {
      const { stateName, cityName, blogEVname, bloglocation, blogdescriction, blognumber, bloglocUrl  } = req.body;
      
      
  
      // Find or create the state
      let state = await State.findOne({ name: stateName });
      if (!state) {
        state = new State({ name: stateName });
        await state.save();
      }
  
      // Find or create the city
      let city = await City.findOne({ name: cityName, state: state._id });
      if (!city) {
        city = new City({ name: cityName, state: state._id, image: req.file ? req.file.filename : null });
        await city.save();
      }
  
      // Create the blog post
      const blog = new Blog({
        EVname : blogEVname,
        location : bloglocation,
        descriction : blogdescriction,
        number : blognumber,
        locUrl : bloglocUrl,
        state: state._id,
        city: city._id,
      });
  
      await blog.save();
  
      res.redirect('/');
    } catch (err) {
      console.error('Error adding details:', err);
      res.status(500).send('Error adding details: ' + err.message);
    }
  });


  app.post('/get-cities', async (req, res) => {
    try {
      const cities = await City.find({ state: req.body.stateId });
      res.json(cities);
    } catch (err) {
      res.status(500).send('Error retrieving cities.');
    }
  });

  app.post('/search', async (req, res) => {
    try {
      const { stateId, cityId } = req.body;
      const blogs = await Blog.find({ state: stateId, city: cityId }).populate('city').populate('state').exec();
      console.log(blogs);
      res.render('blogs', { blogs });
    } catch (err) {
      res.status(500).send('Error retrieving blogs.');
    }
  
  });

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("mongo connected"));
app.listen(PORT,()=>console.log("server started",PORT));
