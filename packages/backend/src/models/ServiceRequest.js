"use strict";

module.exports = (sequelize, DataTypes) => {
  const ServiceRequest = sequelize.define(
    "ServiceRequest",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      cliente_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      profissional_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "professionals", key: "id" },
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pendente", "aceito", "recusado", "concluido"),
        allowNull: false,
        defaultValue: "pendente",
      },
    },
    {
      tableName: "service_requests",
      timestamps: true,
    }
  );

  ServiceRequest.associate = (models) => {
    ServiceRequest.belongsTo(models.User, {
      foreignKey: "cliente_id",
      as: "cliente",
    });
    ServiceRequest.belongsTo(models.Professional, {
      foreignKey: "profissional_id",
      as: "professional",
    });
  };

  return ServiceRequest;
};