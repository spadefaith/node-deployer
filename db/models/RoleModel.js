
export default function (sequelize, DataTypes) {
  const entity = sequelize.define(
    "roles",
    {
      role_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      description: DataTypes.STRING(254),
      ref_name: DataTypes.STRING(254),

      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      modified_dt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_dt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "created_dt",
      updatedAt: "modified_dt",
    }
  );


  return entity;
};
