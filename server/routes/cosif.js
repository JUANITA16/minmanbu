const router = require('express').Router();
const axios = require('axios');
const { getSecret } = require('../utils/secret');

router.get('/tblCosifAccounting', async (req, res) => {
    console.log("Route get /tblCosifAccounting");
    try{
        console.log("Getting secretApiKey");
        const Authorization = await getSecret(process.env.SECRET_APIKEY); // ApiKey para consumir lambdas
        
        const URL = process.env.BACK_BASE + process.env.BACK_COSIF;
        const config = {
            headers: { Authorization }
        }; // Headers a enviar
        const api = await axios.get(URL , config);
        const data = await api.data;

        res.json(data); // Responder los mismos datos que se obtuvieron

        console.log("get success ");
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