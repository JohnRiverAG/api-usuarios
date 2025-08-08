// Rutas CRUD

const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔍 Obtener todos los usuarios
const verificarToken = require('../middleware/auth');

router.get('/', verificarToken, (req, res) => {
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

// ➕ Crear usuario con validaciones y bcrypt
router.post(
    '/',
    [
        body('user_name').isLength({ min: 3 }).withMessage('Nombre mínimo de 3 caracteres'),
        body('user_password').isLength({ min: 6 }).withMessage('Contraseña mínimo de 6 caracteres')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { user_name, user_password } = req.body;
        try {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        db.query(
            'INSERT INTO usuarios (user_name, user_password) VALUES (?, ?)',
            [user_name, hashedPassword],
            (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, user_name });
            }
        );
        } catch (err) {
        res.status(500).json({ error: 'Error al encriptar la contraseña' });
        }
    }
);

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

//Login y generación de JWT
router.post(
    '/login',
    [
        body('user_name').notEmpty(),
        body('user_password').notEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { user_name, user_password } = req.body;

        db.query('SELECT * FROM usuarios WHERE user_name = ?', [user_name], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = results[0];
        const match = await bcrypt.compare(user_password, user.user_password);
        if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ user_id: user.user_id, user_name: user.user_name }, 'secreto_super_seguro', {
            expiresIn: '1h'
        });

        res.json({ token });
        });
    }
);


module.exports = router;
