const AWS = require('aws-sdk');

const getSecret = async (secretId) => {
    const client = new AWS.SecretsManager({
        region: process.env.REGION
    });

    let secret = null;
    const response = await client.getSecretValue({ SecretId: secretId }).promise();
    
    if ("SecretString" in response) {
        secret = response.SecretString;
    }
    
    return secret;
}

module.exports = { getSecret }