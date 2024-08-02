import setUp from './app';

// iniciar server
const PORT =  3001;
const HOST = '0.0.0.0';
setUp().then( app => {
  let server = {};
  try {
    server = app.listen(PORT, HOST);
    console.info(`Running on http://${HOST}:${PORT}`);
  }
  catch(err){
    console.info('Error server:', err.message);
    server.close(() => console.info("Servidor closed"));
  }
})
  .catch( err =>{
    console.info('Error:', err.message);
  });
