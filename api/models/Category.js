// api/models/Category.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name          : { type: String, required: true, unique: true },
  repsLiquid    : { type: Number, default: 0, required: true },
  repsInvested  : { type: Number, default: 0, required: true },
  timeStamp     : { type: Date, default: Date.now },
  color         : { type: String, default: '#000' },
  ownerName     : { type: String, required: true },
  quotes        : [{
                    text  : { type: String, required: true },
                    owner : { type: String, required: true },  
                  }] 
});

CategorySchema.statics.findByName = function(name) {
  return this.where( { "name": name }).findOne().exec(); 
};

CategorySchema.statics.findBySearchTerm = function(searchTerm, cb) {
  return this.find( { "name": { $regex: new RegExp('\\b' + searchTerm, 'i') }}, cb);
};

module.exports = mongoose.model('Category', CategorySchema);
