const jwt = require('jsonwebtoken')

exports.authorAuthentication = async(req, res, next) =>{
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "Header token is required !" });
        }

        //=====the token will decode and will varify========
        jwt.verify(token, 'vaccine', function (err, decoded) { //callback function
            if (err) {
                return res.status(401).send({ status: false, msg: "Invalid Token !! Please Login Again..." });
            }
            else {
                //======setting decoded token to the request obj to make it globally accessible=====
                req.decodedToken = decoded;
                next();
            }
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};