const setUp = require('./app'); // ./app-SSO

// iniciar server
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
setUp().then( app => {
    let server = {};
    try {
        server = app.listen(PORT, HOST);
        console.log(`Running on http://${HOST}:${PORT}`);
    }
    catch(err){
        console.log('Error server:', err.message);
        server.close(() => console.log("Servidor closed"));
    }
})
.catch( err =>{
console.log('Error:', err.message);
})
