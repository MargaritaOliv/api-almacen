const Prenda = require('../models/Prenda');

exports.getAll = async (req, res) => {
    try {
        const prendas = await Prenda.findAll();
        res.json(prendas);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getById = async (req, res) => {
    try {
        const prenda = await Prenda.findByPk(req.params.id);
        if (!prenda) return res.status(404).json({ msg: "No encontrada" });
        res.json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.create = async (req, res) => {
    try {
        const prenda = await Prenda.create(req.body);
        res.status(201).json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.update = async (req, res) => {
    try {
        await Prenda.update(req.body, { where: { id: req.params.id } });
        res.json({ msg: "Actualizado correctamente" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.delete = async (req, res) => {
    try {
        await Prenda.destroy({ where: { id: req.params.id } });
        res.json({ msg: "Eliminado correctamente" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Métodos específicos
exports.getByCategoria = async (req, res) => {
    try {
        const prendas = await Prenda.findAll({ where: { categoria: req.params.categoria } });
        res.json(prendas);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.patchStock = async (req, res) => {
    try {
        const prenda = await Prenda.findByPk(req.params.id);
        if (!prenda) return res.status(404).json({ msg: "No encontrada" });
        prenda.stock += req.body.cantidad;
        await prenda.save();
        res.json(prenda);
    } catch (error) { res.status(500).json({ error: error.message }); }
};