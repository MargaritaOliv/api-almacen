const Prenda = require('../models/Prenda');
const cloudinary = require('../config/cloudinary');

exports.getAll = async (req, res) => {
    try {
        const prendas = await Prenda.findAll({
            where: { userId: req.usuario.id }
        });
        res.json(prendas);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.getById = async (req, res) => {
    try {
        const prenda = await Prenda.findOne({
            where: { 
                id: req.params.id,
                userId: req.usuario.id
            }
        });
        
        if (!prenda) return res.status(404).json({ msg: "No encontrada o no tienes permiso" });
        res.json(prenda);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.create = async (req, res) => {
    try {

        console.log("----- CREANDO PRENDA -----");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const nuevaPrenda = {
            ...req.body,
            userId: req.usuario.id
        };

        if (req.file) {

            const imagenUrl = req.file.path || req.file.secure_url || null;
            const imagenId = req.file.filename || req.file.public_id || null;

            nuevaPrenda.imagen_url = imagenUrl;
            nuevaPrenda.imagen_id = imagenId;
        }

        const prenda = await Prenda.create(nuevaPrenda);

        res.status(201).json(prenda);

    } catch (error) { 
        console.error("ERROR CREATE:", error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.update = async (req, res) => {
    try {
        const prenda = await Prenda.findOne({
            where: {
                id: req.params.id,
                userId: req.usuario.id
            }
        });

        if (!prenda) return res.status(404).json({ msg: "No encontrada o sin permiso" });

        if (req.file) {

            try {
                if (prenda.imagen_id) {
                    await cloudinary.uploader.destroy(prenda.imagen_id);
                }
            } catch (errDestroy) {
                console.error('Error al eliminar imagen previa en Cloudinary:', errDestroy);
            }

            const imagenUrl = req.file.path || req.file.secure_url;
            const imagenId = req.file.filename || req.file.public_id;

            prenda.imagen_url = imagenUrl;
            prenda.imagen_id = imagenId;
        }

        const updates = {};
        ['nombre','categoria','talla','precio','stock'].forEach(k=>{
            if (req.body[k] !== undefined) updates[k] = req.body[k];
        });

        await prenda.update({
            ...updates,
            imagen_url: prenda.imagen_url,
            imagen_id: prenda.imagen_id
        });

        res.json(prenda);

    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const prenda = await Prenda.findOne({
            where: {
                id: req.params.id,
                userId: req.usuario.id
            }
        });

        if (!prenda) return res.status(404).json({ msg: "No encontrada o sin permiso" });

        if (prenda.imagen_id) {
            try {
                await cloudinary.uploader.destroy(prenda.imagen_id);
            } catch (errDestroy) {
                console.error('Error al eliminar imagen en Cloudinary:', errDestroy);
            }
        }

        await prenda.destroy();

        res.json({ msg: "Eliminado correctamente" });

    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.getByCategoria = async (req, res) => {
    try {
        const prendas = await Prenda.findAll({ 
            where: { 
                categoria: req.params.categoria,
                userId: req.usuario.id 
            } 
        });

        res.json(prendas);

    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.patchStock = async (req, res) => {
    try {
        const prenda = await Prenda.findOne({
            where: { 
                id: req.params.id,
                userId: req.usuario.id
            }
        });

        if (!prenda) return res.status(404).json({ msg: "No encontrada" });
        
        const cantidad = Number(req.body.cantidad || 0);

        if (isNaN(cantidad)) {
            return res.status(400).json({ msg: "cantidad inválida" });
        }

        prenda.stock += cantidad;

        await prenda.save();

        res.json(prenda);

    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};