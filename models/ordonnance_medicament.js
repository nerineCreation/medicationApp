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

const OrdonnanceMedicament = sequelize.define('med_ords', {
  // Model attributes are defined here
  med_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  ord_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
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

module.exports = OrdonnanceMedicament
