const jwt = require('jsonwebtoken');            // jwt pour configurer systeme de jeton de securité

module.exports = (req, res, next) => {
  try {                                         // verification du jeton (token) avec celui de l utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {                                  // utilisateur a acces a l'application
      next();
    }
  } catch {                                   // connection non autorisé
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};