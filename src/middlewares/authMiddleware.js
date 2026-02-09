const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Log para depuración
    console.log('--- Verificando Token ---');

    if (!authHeader) {
        return res.status(401).json({ msg: "Acceso denegado. No hay token." });
    }

    try {
        const token = authHeader.split(' ')[1];
        
        // CAMBIO IMPORTANTE: Usar process.env.JWT_SECRET
        // Esto debe coincidir con lo que pusimos en authController y .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = decoded;
        console.log('✅ Token válido. Usuario ID:', decoded.id);
        next();

    } catch (error) {
        console.log('❌ Error al verificar token:', error.message);
        res.status(401).json({ 
            msg: "Token no válido.", 
            error: error.message 
        });
    }
};