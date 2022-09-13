const { success, errno } = require('../assets/functions')
const Ordonnances = require('../models/ordonnaces')
const OrdonnanceMedicament = require('../models/ordonnance_medicament')

const https = require('https')
const Sequelize = require('sequelize')

require('dotenv').config()
//const sequelize = new Sequelize(process.env.DB_PATH)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.LOGIN, process.env.PWD, {
  host: process.env.HOST,
  dialect: process.env.DB_TYPE,
  define: {
    charset: process.env.CHARTSET,
    dialectOptions: {
      collate: process.env.COLLATE
    },
  },
});


const getOrdonnances = ((req, res) => {
  console.log('getOrdonnances')
  Ordonnances.findAll({ attributes: ['ord_name'], limit: 20, order: ['ord_name'] })
    .then(result => res.json(success({ result })))
    .catch(error => res.json(errno({msg: error})))
})

const getOrdonnancebyID = (async (req, res) => {
  console.log('getOrdonnancebyID')
  const ordonnanceID = req.params.ordonnance_id

  if(ordonnanceID != 'undefined') {
    ordonnance = await OrdonnanceMedicament.findAll({ include: [{ association: ['ordonnances', 'medicaments'],
                                                                  attributes: ['med_name', 'ord_name'], 
                                                                  where: { ord_id: ordonnanceID } }] })
      .then(ordonnance => res.json(success({ ordonnance })))
      .catch(() => res.json(errno({msg: 'Ordonnance pas trouvé'})))
  }
})

const getOrdonnancebyStatus = ((req, res) => {
  console.log('getOrdonnancebyStatus')
  const statut = req.params.ordonnanceStatus
  
  if(statut != 'undefined') {
    Ordonnances.findAll({ attributes: ['ord_id', 'ord_name'], where: { ord_statut: statut }, limit: 20, order: ['ord_name'] })
    .then(result => res.json(success({ result })))
    .catch(error => res.json(errno({msg: error})))
  }
})

const createOrdonnance = (async (req, res) => {
  console.log('createOrdonnance')
  const ID = req.params.ordonnanceID
  const name = req.params.ordonnanceName
  const statut = req.params.ordonnaceStatut

  ordonnance = await Ordonnances.create({ ord_id: ID, ord_name: name, ord_statut: statut })
    .then(() => res.json(success({ msg: 'Ordonnance créée' })))
    .catch(() => res.json(errno({ msg: 'Ordonnance non créée!'})))
})

const updateOrdonnance = (async (req, res) => {
  console.log('updateOrdonnance')
  const ID = req.params.ordonnanceID
  const name = req.params.ordonnanceName
  const statut = req.params.ordonnanceStatus

  await Ordonnances.update({ ord_name: name, ord_statut: statut }, { where: { ord_id: ID } })
    .then(() => res.json(success({ msg: 'Ordonnance mise à jour' })))
    .catch(() => res.json(errno({ msg: 'Ordonnance non mise à jour!'})))
})

const deleteOrdonnance = (async (req, res) => {
  console.log('deleteOrdonnance')
  const ID = req.params.ordonnanceID
  
  await Ordonnances.destroy({ where: { ord_id: ID } })
  .then(() => res.json(success({ msg: 'Ordonnance supprimée' })))
  .catch(() => res.json(errno({ msg: 'Ordonnance non supprimée!'})))
 })

module.exports = {
  getOrdonnances,
  getOrdonnancebyID,
  getOrdonnancebyStatus,
  createOrdonnance,
  updateOrdonnance,
  deleteOrdonnance
}