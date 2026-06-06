"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [2, 100] },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM("cliente", "profissional"),
        allowNull: false,
        defaultValue: "cliente",
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Professional, {
      foreignKey: "user_id",
      as: "professional",
    });
    User.hasMany(models.ServiceRequest, {
      foreignKey: "cliente_id",
      as: "clientRequests",
    });
  };

  return User;
};