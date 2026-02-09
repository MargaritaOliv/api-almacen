const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/db');
const User = require('./src/models/User');
const Prenda = require('./src/models/Prenda');

const authRoutes = require('./src/routes/authRoutes');
const ropaRoutes = require('./src/routes/ropaRoutes');

const authMiddleware = require('./src/middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

User.hasMany(Prenda, { foreignKey: 'userId' });
Prenda.belongsTo(User, { foreignKey: 'userId' });
app.use('/api/auth', authRoutes);
app.use('/api/prendas', authMiddleware, ropaRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
    .then(() => {
        console.log('--------------------------------------------------');
        console.log('✅ Conexión a MySQL exitosa y tablas sincronizadas');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        });
        console.log('--------------------------------------------------');
    })
    .catch(err => {
        console.error('❌ Error crítico al conectar con la base de datos:');
        console.error(err.message);
    });