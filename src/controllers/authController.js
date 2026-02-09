const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ nombre, email, password: hashedPassword });

        // CAMBIO: Generamos el token inmediatamente al registrarse
        // para que la App Android pueda guardarlo si lo necesita.
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.status(201).json({ 
            msg: "Usuario creado", 
            userId: user.id,
            token: token,     // Enviamos el token
            user: { id: user.id, nombre: user.nombre } 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Credenciales inválidas" });

        // CAMBIO: Usamos process.env.JWT_SECRET
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );
        
        res.json({ token, user: { id: user.id, nombre: user.nombre } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};