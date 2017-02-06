'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _foodtruck = require('./foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ReviewSchema = new Schema({
  title: String,
  text: String,
  foodtruck: { type: Schema.Types.ObjectId, ref: 'FoodTruck' }
});

module.exports = _mongoose2.default.model('Review', ReviewSchema);
//# sourceMappingURL=review.js.map