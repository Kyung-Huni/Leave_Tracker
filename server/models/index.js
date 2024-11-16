const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const databaseName = process.env.DB_NAME
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const options = {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '+09:00', // 한국 시간대
  logging: false, // SQL 쿼리 로깅 비활성화
}

const sequelize = new Sequelize(databaseName, user, password, options)
const db = {}

// 연결 테스트
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Unable to connect to the database:', err))

// 모델 로드
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

// 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 동기화
sequelize
  .sync()
  .then(() => console.log('Database synced!'))
  .catch((err) => console.error('Database sync error:', err))

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
