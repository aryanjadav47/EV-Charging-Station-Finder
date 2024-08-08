const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  createdAt: { type: Date, default: Date.now },
EVname:{
    type:String,
    required:true,
},
location:{
    type:String,
    required:true,
},
descriction:{
    type:String,
    required:true,
},
number:{
    type:String,
    required:true,
},
locUrl:{
    type:String,
    required:true,
},
}, {timestamps : true});

module.exports = mongoose.model('Blog', blogSchema);
