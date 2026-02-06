const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/db');
require('./src/models/User');
require('./src/models/Prenda');

const authRoutes = require('./src/routes/authRoutes');
const ropaRoutes = require('./src/routes/ropaRoutes');

const authMiddleware = require('./src/middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/prendas', authMiddleware, ropaRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
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