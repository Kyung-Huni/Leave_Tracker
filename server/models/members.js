module.exports = function (sequelize, DataTypes) {
  var members = sequelize.define(
    'members',
    {
      // 군번
      unitId: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        unique: true, // 인덱싱 추가
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
