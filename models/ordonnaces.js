const { Sequelize, DataTypes } = require('sequelize')

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

const Ordonnance = sequelize.define('ordonnances', {
  // Model attributes are defined here
  ord_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  ord_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ord_statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
});

// `sequelize.define` also returns the model
console.log(Ordonnance === sequelize.models.Ordonnance); // true

module.exports = Ordonnance