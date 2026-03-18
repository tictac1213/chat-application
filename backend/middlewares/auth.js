import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next){
    try {
        
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                msg: 'Access denied. No token provided.'
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        
        console.log('Error in auth middleware: ' + error);
        return res.status(401).json({
            msg: 'Invalid or expired token.'
        });
        
    }
}