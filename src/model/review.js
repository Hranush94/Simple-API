import mongoose from 'mongoose';
import FoodTruck from './foodtruck';
let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
  title: String,
  text: String,
  foodtruck: {type: Schema.Types.ObjectId, ref: 'FoodTruck'}
});

module.exports = mongoose.model('Review', ReviewSchema);
