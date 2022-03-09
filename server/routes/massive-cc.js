const router = require('express').Router();
const axios = require('axios');
//const { getToken } = require('../utils/tokenBack');
//const { getSecret } = require('../utils/secret');

router.post('/massive/cc', async (req, res) => {
    console.log("Route post /massive/cc");
    try{
        const URL = process.env.BACK_BASE + process.env.BACK_PATH + process.env.BACK_MASSIVE;
        const config = {};
        const body = req.body;
        /*
        console.log("Getting secretLambda");
        const secret = await getSecret(process.env.SECRET_LAMBDA);
        const Authorization = await getToken(secret); // Token para consumir lambdas
        const config = { headers: { Authorization }}; // Headers a enviar
        */
        const api = await axios.post(URL, body, config);
        const data = await api.data;

        res.json(data); // Responder los mismos datos que se obtuvieron

        console.log("post success");
    } catch (err){
        if( !err.response ){
            err.response = {
                status: 500,
                data: { error: err.message }
            }
        }
        const { status, data } = err.response;
        console.log("Error",data);
        res.status(status).json( data );
    }
})

module.exports = router;