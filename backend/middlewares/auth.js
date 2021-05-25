// pack pour utilisation du TOKEN
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du TOKEN
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décoder le TOKEN récupéré
        const userId = decodedToken.userId; // récuper l'utilisateur par le le TOKEN décoder de l'utilisateur

        //vérification de l'userId
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};