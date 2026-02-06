const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Log para ver si llega el header
    console.log('--- Verificando Token ---');
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        console.log('❌ Acceso denegado: No se proporcionó header');
        return res.status(401).json({ msg: "Acceso denegado. No hay token." });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // Log para confirmar la clave secreta que se está usando
        console.log('Usando Secret:', process.env.JWT_SECRET ? 'Configurado ✅' : 'No encontrado ❌');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        
        console.log('✅ Token válido para usuario ID:', decoded.id);
        next();
    } catch (error) {
        console.log('❌ Error al verificar token:', error.message);
        res.status(401).json({ 
            msg: "Token no válido.", 
            error: error.message 
        });
    }
};