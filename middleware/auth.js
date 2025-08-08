//Middleeare para proteger las rutas

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token requerido' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'secreto_super_seguro');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = verificarToken;
