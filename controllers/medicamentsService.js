const { success, errno } = require('../assets/functions')
const Medicaments = require('../models/medicaments')
const OrdonnanceMedicament = require('../models/ordonnance_medicament')

const parse = require('csv-parser')
const path = require('path')
const fs = require('fs')
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

let downloadFolder = __dirname
downloadFolder = downloadFolder.replace('controllers', '') + 'download'

async function loadMedicaments () {
  console.log('loadMedicaments')

  let state_cip = await load_cip() 
  let state_cis = await load_cis(state_cip)
  console.log(state_cis)
  sequelize.close()
};



const getMedicaments = ((req, res) => {
  console.log('getMedicaments')
  Medicaments.findAll({ attributes: ['med_name'], limit: 20, order: ['med_name'] })
    .then(result => { res.json(success( result )) })
    .catch(error => res.json(errno({msg: error})))
    sequelize.close()
});


const getMedicamentbyID = (async (req, res) =>  {
  console.log('getMedicamentbyID')
  const medCipID = req.params.medicament_id

  if(medCipID != 'undefined') {
      medicament = await Medicaments.findAll({attributes: ['med_id'], where: { med_cip_id: medCipID } })
      .then((medicament) => { 
        if(medicament.med_id == 'undefined') { 
          res.json('Aucun médicament trouvé') 
        } else { 
          const url = 'https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=' + medicament.med_id + '&typedoc=N'
          res.redirect(url) 
        }   
      })
      .catch(() => { res.json(errno('ID médicament pas trouvé')) })
  }

  sequelize.close()
});


const getMedicamentbyName = (async (req, res) => {
  console.log('getMedicamentbyName')
  const medicamentName = req.params.medicamentName

  if(medicamentName != 'undefined') {
    medicament = await Medicaments.findAll({ attributes: ['med_name'], 
                       where: { med_name: sequelize.where(sequelize.fn('LOWER', sequelize.col('med_name')), 'LIKE', medicamentName + '%') }, limit: 20, order: ['med_name']})
    .then((medicament) => { 
      if(medicament.med_name == 'undefined') { 
        res.json('Aucun médicament trouvé') 
      } else { 
        res.json(success( medicament ))
      } 
    })
    .catch(() => { res.json(errno('Nom médicament pas trouvé')) })
  }

  sequelize.close()
});


function load_cip() {
  const url = 'https://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_CIP_bdpm.txt'
  const fileName = path.join(downloadFolder, 'CIP.txt')
  // Open & save file read file & load / update DB
  console.log('load_cip')
  return new Promise((resolve, reject) => {
    const req = https.get(url, async (res) => {
      const readStream = fs.createReadStream(fileName)
        .pipe(parse({headers: false, separator: '\t', encoding: 'utf8',}))

        .on('data', async (row) => {
          if(row[6] != 'undefined') {
            medicament = await Medicaments.findAll({ attributes: ['med_id'], where: { med_id: row[0], med_cip_id: row[6] } })
              .then(async (medicament) => {
                if( medicament == 'undefined' )  {
                  medicamenttoCreate = await Medicaments.create({ med_id: row[0], med_cip_id: row[6] })
                    .then((medicamenttoCreate) => { { res.json(success( medicamenttoCreate )) } })
                    .catch(() => { res.json(errno('Ajout impossible')) })
                }
              })
              .catch(() => { res.json(errno('ID médicament pas trouvé')) })   
          }
        })

        .on('end', () => {
          console.log('CSV file successfully processed')
          resolve(res.json({ msg: 'CIP load complete' }))
        })
    })

    req.on('error', (err) => { errno(err) })
    req.end()
  })
}

function load_cis(statut_cis) {
  const url = 'https://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_bdpm.txt'
  const fileName = path.join(downloadFolder, 'CIS.txt')
  
  // Open & save file read file & load / update DB
  console.log(statut_cis)
  console.log('load_cis')
  return new Promise((resolve, reject) => {
    const req = https.get(url, async (res) => {
      const readStream = fs.createReadStream(fileName)
      .pipe(parse({headers: false, separator: '\t', encoding: 'utf8',}))
      
      .on('data', async (row) => {
        if(row[0] != undefined) {
          updatedRows = await Medicaments.update({ med_name: row[1], }, { where: { med_id: row[0] }, })
          .then((updatedRows) => { { res.json(success( updatedRows )) } })
          .catch(() => { res.json(errno('Mise à jour impossible')) })
          
        }
      })

      .on('end', () => {
        console.log('CSV file successfully processed')
        resolve(res.json({msg: 'CIS load complete' }))
      })
    
    })
    .on('error', (err) => { errno(err) })
    req.end()
  })
}

const createMedicamentOrdonnance = (async (req, res) => {
  console.log('createMedicamentOrdonnance')
  const ordonnanceID = req.params.ordonnanceID
  const medicamentID = req.params.medicamentID

  medicamentExist = await OrdonnanceMedicament.findAll({ attribute: ['ord_id'], where: { ord_id: ordonnanceID, med_id: medicamentID }})
  .then(async (medicamentExist) => { {
    if(medicamentExist.ord_id == 'undefined') {
      await OrdonnanceMedicament.create({ ord_id: ordonnanceID, med_id: medicamentID })
      .then(() => { { res.json(success({ msg: 'Médicament ajouté à l\'ordonnance' } )) } })
      .catch(() => { res.json(errno('Ajout impossible')) }) 
    
    } else {
      res.json(success({ msg: 'Le médicament existe déjà' }))
    }
  }})
  .catch(() => { res.json(errno('Ajout impossible')) })



})

const deleteMedicamentOrdonnance = (async (req, res) => {
  console.log('updateMedicamentOrdonnance')
  const ordonnanceID = req.params.ordonnanceID
  const medicamentID = req.params.medicamentID

  await OrdonnanceMedicament.destroy({ where: { ord_id: ordonnanceID, med_id: medicamentID } })
})


module.exports = {
  loadMedicaments,
  getMedicaments,
  getMedicamentbyID,
  getMedicamentbyName,
  createMedicamentOrdonnance,
  deleteMedicamentOrdonnance
}

