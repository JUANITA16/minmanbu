
const routeGuard = (accessMatrix) => {
    return (req, res, next) => {
        console.info("Inicio middleware de validación")
        if (req.authInfo.roles === undefined) return res.status(403).json({error: 'User without roles'});
        const roles = req.authInfo.roles;
        let path = false;
        /* Automatico */
        for(const route in accessMatrix){ // Recorrer cada ruta configurada
            if (req.path.includes(accessMatrix[route].path)) {
                path = true;
                if (accessMatrix[route].methods.includes(req.method)) {
                    let intersection = accessMatrix[route].roles.filter(role => roles.includes(role));
                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                    break;
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            } 
        }
        if(!path) return res.status(403).json({error: 'Unrecognized path'});
        next();
    }
}

module.exports = routeGuard;
