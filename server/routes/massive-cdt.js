const router = require('express').Router();
const axios = require('axios');
const { getSecret } = require('../utils/secret');

router.post('/massive/cdt', async (req, res) => {
    console.log("Route post /massive/cdt");
    try{
        console.log("Getting secretApiKey");
        const Authorization = await getSecret(process.env.SECRET_APIKEY); // ApiKey para consumir lambdas
        
        const URL = process.env.BACK_BASE + process.env.BACK_MASSIVE;
        const config = {
            headers: { Authorization }
        };
        const body = req.body;

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