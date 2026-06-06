"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const senhaDemo  = await bcrypt.hash("123456", 10);
    const senhaExtra = await bcrypt.hash("senha123", 10);

    await queryInterface.bulkInsert("users", [
      { nome: "Ana Souza",      email: "cliente@biko.com", senha: senhaDemo,  tipo: "cliente",       createdAt: new Date(), updatedAt: new Date() },
      { nome: "Carlos Silva",   email: "pro@biko.com",     senha: senhaDemo,  tipo: "profissional", createdAt: new Date(), updatedAt: new Date() },
      { nome: "Bruno Lima",     email: "bruno@biko.com",   senha: senhaExtra, tipo: "cliente",       createdAt: new Date(), updatedAt: new Date() },
      { nome: "Diana Costa",    email: "diana@biko.com",   senha: senhaExtra, tipo: "profissional", createdAt: new Date(), updatedAt: new Date() },
      { nome: "Eduardo Rocha",  email: "eduardo@biko.com", senha: senhaExtra, tipo: "profissional", createdAt: new Date(), updatedAt: new Date() },
      { nome: "Fernanda Melo",  email: "fernanda@biko.com",senha: senhaExtra, tipo: "profissional", createdAt: new Date(), updatedAt: new Date() },
    ]);

    await queryInterface.bulkInsert("professionals", [
      {
        user_id: 2,
        categoria: "Encanador",
        bairro: "Vila Madalena",
        descricao: "Encanador com 10 anos de experiência. Atendo emergências.",
        telefone: "(11) 9 8765-4321",
        rating: 4.9,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        categoria: "Eletricista",
        bairro: "Pinheiros",
        descricao: "Instalações elétricas residenciais e comerciais.",
        telefone: "(11) 9 7654-3210",
        rating: 4.7,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 5,
        categoria: "Pintor",
        bairro: "Perdizes",
        descricao: "Pintura interna e externa, acabamento premium.",
        telefone: "(11) 9 6543-2109",
        rating: 4.5,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 6,
        categoria: "Diarista",
        bairro: "Lapa",
        descricao: "Limpeza residencial completa. Produtos inclusos.",
        telefone: "(11) 9 5432-1098",
        rating: 5.0,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("service_requests", [
      {
        cliente_id: 1,
        profissional_id: 1,
        descricao: "Preciso trocar o encanamento da cozinha, está vazando há 2 dias.",
        status: "aceito",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cliente_id: 2,
        profissional_id: 2,
        descricao: "Instalação de tomadas no quarto.",
        status: "pendente",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cliente_id: 1,
        profissional_id: 4,
        descricao: "Limpeza completa do apartamento, 3 quartos.",
        status: "concluido",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("service_requests", null, {});
    await queryInterface.bulkDelete("professionals", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};