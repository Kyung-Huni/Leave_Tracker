module.exports = function (sequelize, DataTypes) {
  var records = sequelize.define('records', {
    // PK
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    // 출발일
    departureDate: {
      type: DataTypes.DATE, // DATE 형식 사용
      allowNull: false,
    },

    // 복귀일
    returnDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    // 휴가종류 (연가, 위로, 포상)
    leaveType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // 비고, 휴가추가설명
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  })

  records.associate = function (models) {
    records.belongsTo(models.members, {
      foreignKey: 'unitId',
      onDelete: 'CASCADE', // 부대원이 삭제되면, 그와 연관된 출타기록 삭제
      // 군번이 변경될일은 없기에 onUpdate는 생략
    })
  }

  return records
}
