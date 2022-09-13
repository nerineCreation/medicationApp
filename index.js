const express = require('express')
const morgan = require('morgan')


const medicamentsRoute = require('./routes/medicamentRoute')
const ordonnancesRoute = require('./routes/ordonnanceRoute')

const app = express()

app.use(morgan('dev')) 

app.use(express.json())
app.use(process.env.ROOT_API + '/medicaments', medicamentsRoute)
app.use(process.env.ROOT_API + '/ordonnances', ordonnancesRoute)

app.listen(process.env.PORT, () => console.log('Listening on port : ' + process.env.PORT))


