const router = require('express').Router();
const axios = require('axios');
const { getSecret } = require('../utils/secret');

router.get('/files', async (req, res) => {
    try{
        const Authorization = await getSecret(process.env.SECRET_APIKEY); // ApiKey para consumir lambdas
        
        const URL = process.env.BACK_BASE + "/files/" + req.query.reqUrl;
        delete req.query.reqUrl
        const config = { 
            params: req.query,
            headers: { Authorization }
        }; // Headers a enviar
        const api = await axios.get(URL, config);
        const data = await api.data;

        res.json(data); // Responder los mismos datos que se obtuvieron

    } catch (err){
        if( !err.response ){
            err.response = {
                status: 500,
                data: { error: err.message }
            }
        }
        const { status, data } = err.response;
        console.error("Error", 500);
        res.status(status).json( data );
    }
})

module.exports = router;