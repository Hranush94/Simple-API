import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import bodyParser from 'body-parser';
import passport from 'passport';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  /**
   * @api {GET} /foodtruck GET All Food Trucks
   * @apiVersion 0.1.0
   * @apiGroup Foodtrucks
   */
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  /**
   * @api {GET} /foodtruck/:id GET Specific Food Truck
   * @apiVersion 0.1.0
   * @apiGroup Foodtrucks
   */
  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  /**
   * @api {POST} /foodtruck/add  POST Foodtruck
   * @apiVersion 0.1.0
   * @apiParam {String} name Foodtruck Name.
   * @apiParam  {String} foodtype Foodtruck Type.
   * @apiParam  {Number} avgcost Foodtruck Average Cost.
   * @apiParam {Object} geometry Foodtruck Location Coordinates.
   * @apiParamExample {json} Request-Example:
   *
   *  {
   *    "avgcost": 100,
   *    "foodtype": "Sushi Truck ",
   *    "name": "Wasabi",
   *    "geometry": {
   *      "coordinates": {
   *        "long": 44.51514225738774,
   *        "lat": 40.18158721064374
   *      },
   *      "type": "Point"
   *    }
   *  }
   *
   * @apiHeader {String} Authorization Users unique access-token example 'Bearer {token}.
   * @apiGroup Foodtrucks
   */
  api.post('/add', authenticate,  (req, res) => {
    console.log('mtav')
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

    newFoodTruck.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Food Truck saved successfully' });
    });
  });


  /**
   * @api {DELETE} /foodtruck/:id  DELETE Foodtruck
   * @apiVersion 0.1.0
   * @apiHeader {String} Authorization Users unique access-token for example  'Bearer {token}'.
   * @apiGroup Foodtrucks
   */
  api.delete('/:id',  authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) =>{
        if (err) {
          res.status(500).send(err);
          return;
        }

        if (foodtruck === null) {
          res.status(404).send("FoodTruck not found");
          return;
        }

        FoodTruck.remove({
          _id: req.params.id
        }, (err, foodtruck) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          Review.remove({
            foodtruck: req.params.id
          }, (err, review) => {
            if (err) {
              res.send(err);
            }
            res.json({message: "Food Truck and Reviews Successfully Removed"});
          });
        });
    })
  });

  /**
   * @api {PUT} /foodtruck/:id  PUT Update an existing record
   * @apiVersion 0.1.0
   * @apiHeader {String} Authorization Users unique access-token for example  'Bearer {token}'.
   *  * @apiParamExample {json} Request-Example:
   *
   *  {
   *    "name": "Another Name"
   *  }
   *
   * @apiGroup Foodtrucks
   */
  api.put('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name || foodtruck.name;
      foodtruck.foodtype = req.body.foodtype || foodtruck.foodtype;
      foodtruck.avgcost = req.body.avgcost || foodtruck.avgcost;
      foodtruck.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Food Truck info updated' });
      });
    });
  });


  /**
   * @api {POST} /foodtruck/reviews/add/:id  POST  Review by a specific foodtruck id
   * @apiVersion 0.1.0
   * @apiParam {String} title Foodtruck Review Title.
   * @apiParam  {String} text Foodtruck Review Text.
   * @apiParamExample {json} Request-Example:
   *
   *  {
   *    "title": "Amazing!",
   *    "text": "Nice service"
   *  }
   *
   * @apiHeader {String} Authorization Users unique access-token example  'Bearer {token}.
   * @apiGroup Foodtrucks
   */
  api.post('/reviews/add/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved' });
        });
      });
    });
  });


  /**
   * @api {GET} /foodtruck/reviews/:id GET Reviews for a specific foodtruck id
   * @apiVersion 0.1.0
   * @apiGroup Foodtrucks
   */
  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;
}
