const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prenda = sequelize.define('Prenda', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    categoria: { type: DataTypes.STRING },
    talla: { type: DataTypes.STRING(10) },
    precio: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Prenda;