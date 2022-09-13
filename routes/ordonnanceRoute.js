const express = require('express')
const ordonnanceRouter = express.Router()

const {
  getOrdonnances,
  getOrdonnancebyID,
  getOrdonnancebyStatus,
  createOrdonnance,
  updateOrdonnance,
  deleteOrdonnance
} = require('../controllers/ordonnancesService')



ordonnanceRouter.get('/getOrdonnancebyID/:OrdonnanceID', getOrdonnancebyID);
ordonnanceRouter.get('/getOrdonnancebyStatus/:OrdonnanceStatus', getOrdonnancebyStatus);
ordonnanceRouter.get('/createOrdonnance/:ordonnanceID/:ordonnanceName/:ordonnaceStatut', createOrdonnance)
ordonnanceRouter.get('/updateOrdonnance/:ordonnanceID/:ordonnanceName/:ordonnaceStatut', updateOrdonnance)
ordonnanceRouter.get('/deleteOrdonnance/:ordonnanceID', deleteOrdonnance)
ordonnanceRouter.get('/getOrdonnances', getOrdonnances)

module.exports = ordonnanceRouter