"use strict";

module.exports = (sequelize, DataTypes) => {
  const Professional = sequelize.define(
    "Professional",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      categoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      bairro: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "professionals",
      timestamps: true,
    }
  );

  Professional.associate = (models) => {
    Professional.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Professional.hasMany(models.ServiceRequest, {
      foreignKey: "profissional_id",
      as: "serviceRequests",
    });
  };

  return Professional;
};