// require express
const express = require('express')

// require passport for requireToken
const passport = require('passport')

// require bike schema
const Bike = require('./../models/bike')

// require custom error messages
const customErrors = require('../../lib/custom_errors')

// variable calling the handle404 method for handle404 function
const handle404 = customErrors.handle404

// requireOwnership messaging for someone trying to access another persons bike
const requireOwnership = customErrors.requireOwnership

// require middleware that will remove blank fields from `req.body`
const removeBlanks = require('../../lib/remove_blank_fields')

// make variable for requireToken for users
const requireToken = passport.authenticate('bearer', { session: false })

// use the router middleware with variable `router`
const router = express.Router()

// CREATE
// POST /bikes
router.post('/bikes', requireToken, (req, res, next) => {
  // set variable bikeData to req.body.bike
  const bikeData = req.body.bike
  // set owner of new bike to the current user
  bikeData.owner = req.user.id

  Bike.create(bikeData)
    // respond to create with 201 if created correctly
    .then(bike => {
      res.status(201).json({ bike: bike.toObject() })
    })
    // if an error pass it to error handler
    .catch(next)
})

// INDEX
// GET /bikes
router.get('/bikes', requireToken, (req, res, next) => {
  Bike.find()
    // when successful return all bikes in the owned list
    .then(bikes => {
      return bikes.map(bike => bike.toObject())
    })
    // respond with 200 status and make bikes JSON object
    .then(bikes => res.status(200).json({ bikes }))
    // if an error pass it to error handler
    .catch(next)
})

// DESTROY
// DELETE /bikes/:id
router.delete('/bikes/:id', requireToken, (req, res, next) => {
  // create bikeId variable with req.params.id
  const bikeId = req.params.id

  // find the bike by the id
  Bike.findById(bikeId)
    // if not the correct id throw 404
    .then(handle404)
    // if correct bikeId make sure it's the owner of that bike with requireOwnership
    .then(bike => {
      requireOwnership(req, bike)
      // delete the bike if owner is verified
      bike.deleteOne()
    })
    // send back 204 no content if delete happened
    .then(() => res.sendStatus(204))
    // if an error pass it to error handler
    .catch(next)
})

// SHOW
// GET /bikes/:id
router.get('/bikes/:id', requireToken, (req, res, next) => {
  // create bikeId variable with req.params.id
  const bikeId = req.params.id

  // find the bike by the id
  Bike.findById(bikeId)
    // if not the correct id throw 404
    .then(handle404)
    // if correct id respond with 200 and show the bike in JSON
    .then(bike => res.status(200).json({ bike: bike.toObject() }))
    // if an error pass it to error handler
    .catch(next)
})

// export router
module.exports = router
