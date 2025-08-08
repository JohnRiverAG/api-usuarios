// Rutas CRUD

const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Obtener todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// 🔍 Obtener un usuario por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM usuarios WHERE user_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
});

// ➕ Crear un nuevo usuario
router.post('/', (req, res) => {
    const { user_name, user_password } = req.body;
    db.query('INSERT INTO usuarios (user_name, user_password) VALUES (?, ?)', [user_name, user_password], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: result.insertId, user_name, user_password });
    });
});

// ✏️ Actualizar un usuario
router.put('/:id', (req, res) => {
    const { user_name, user_password } = req.body;
    db.query('UPDATE usuarios SET user_name = ?, user_password = ? WHERE user_id = ?', [user_name, user_password, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario actualizado' });
    });
});

// ❌ Eliminar un usuario
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM usuarios WHERE user_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario eliminado' });
    });
});

module.exports = router;
