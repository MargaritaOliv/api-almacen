const Prenda = require('../models/Prenda');

exports.getAll = async (req, res) => {
    try {
        // FILTRO: Solo devolver prendas del usuario logueado
        const prendas = await Prenda.findAll({
            where: { userId: req.usuario.id }
        });
        res.json(prendas);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getById = async (req, res) => {
    try {
        // FILTRO: Buscar por ID de prenda Y ID de usuario
        const prenda = await Prenda.findOne({
            where: { 
                id: req.params.id,
                userId: req.usuario.id
            }
        });
        
        if (!prenda) return res.status(404).json({ msg: "No encontrada o no tienes permiso" });
        res.json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.create = async (req, res) => {
    try {
        // ASIGNACIÓN: Agregamos el userId del token a los datos de la prenda
        const nuevaPrenda = {
            ...req.body,
            userId: req.usuario.id
        };
        const prenda = await Prenda.create(nuevaPrenda);
        res.status(201).json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.update = async (req, res) => {
    try {
        // SEGURIDAD: Solo actualizar si coincide el ID y el userId
        const resultado = await Prenda.update(req.body, { 
            where: { 
                id: req.params.id,
                userId: req.usuario.id 
            } 
        });

        if (resultado[0] === 0) {
            return res.status(404).json({ msg: "No se pudo actualizar (No encontrada o sin permiso)" });
        }

        res.json({ msg: "Actualizado correctamente" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.delete = async (req, res) => {
    try {
        // SEGURIDAD: Solo eliminar si coincide el ID y el userId
        const deleted = await Prenda.destroy({ 
            where: { 
                id: req.params.id,
                userId: req.usuario.id 
            } 
        });

        if (!deleted) return res.status(404).json({ msg: "No encontrada o sin permiso" });
        
        res.json({ msg: "Eliminado correctamente" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Métodos específicos
exports.getByCategoria = async (req, res) => {
    try {
        const prendas = await Prenda.findAll({ 
            where: { 
                categoria: req.params.categoria,
                userId: req.usuario.id // Filtro de usuario
            } 
        });
        res.json(prendas);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.patchStock = async (req, res) => {
    try {
        // Primero buscamos asegurando que pertenezca al usuario
        const prenda = await Prenda.findOne({
            where: { 
                id: req.params.id,
                userId: req.usuario.id
            }
        });

        if (!prenda) return res.status(404).json({ msg: "No encontrada" });
        
        prenda.stock += req.body.cantidad;
        await prenda.save();
        res.json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};