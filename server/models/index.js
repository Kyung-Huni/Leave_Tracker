const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')

const databaseName = 'leave_tracker'
const user = 'root'
const password = '1234'
const options = {
  host: '127.0.0.1',
  dialect: 'mysql',
}

var sequelize = new Sequelize(databaseName, user, password, options)
var db = {}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file != 'index.js'
  })
  .forEach(function (file) {
    var model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

sequelize.sync()

module.exports = db
