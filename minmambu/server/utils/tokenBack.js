const axios = require('axios');

const getToken = async (secret) => {
    try{
        console.log("Getting token");

        const params = new URLSearchParams();
        params.append("client_id", secret.client_id);
        params.append("client_secret", secret.client_secret);
        params.append("resource", secret.resource);
        params.append("grant_type", secret.grant_type);
        params.append("token_type", secret.token_type);

        const res = await axios.post(process.env.AUTH_URL, params, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const data = await res.data;

        console.log("Token got");
        return data.access_token;
    }
    catch(err){
        console.log("Error getToken", err.message);
        return "error token";
    }
    
}

module.exports = { getToken }