const express = require('express')
const medicamentRouter = express.Router()

const {
    loadMedicaments,
    getMedicaments,
    getMedicamentbyID,
    getMedicamentbyName,
    createMedicamentOrdonnance,
    deleteMedicamentOrdonnance
} = require('../controllers/medicamentsService')


medicamentRouter.get('/loadMedicaments', loadMedicaments);
medicamentRouter.get('/getMedicamentbyID/:medicament_id', getMedicamentbyID);
medicamentRouter.get('/getMedicamentbyName/:medicamentName', getMedicamentbyName);
medicamentRouter.get('/createMedicamentOrdonnance/:ordonnanceID/:medicamentID', createMedicamentOrdonnance);
medicamentRouter.get('/deleteMedicamentOrdonnance/:ordonnanceID/:medicamentID', deleteMedicamentOrdonnance);
medicamentRouter.get('/getMedicaments', getMedicaments);

module.exports = medicamentRouter