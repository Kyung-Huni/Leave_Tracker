module.exports = function (sequelize, DataTypes) {
  var members = sequelize.define(
    'members',
    {
      // Id
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      // 계급
      rank: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      // 이름
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      // 소속 대대, 중대
      unit: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { timestamps: false }
  )

  // 출타기록 테이블과 associate
  members.associate = function (models) {
    members.hasMany(models.records)
  }

  return members
}
