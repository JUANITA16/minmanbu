const routeGuard = (accessMatrix) => {
    return (req, res, next) => {
        console.log("Validate auth")
        if (req.authInfo.roles === undefined) return res.status(403).json({error: 'No roles found!'});
        else {
            const roles = req.authInfo.roles;

            if (req.path.includes(accessMatrix.cargue.path)) {
                if (accessMatrix.cargue.methods.includes(req.method)) {
                    let intersection = accessMatrix.cargue.roles.filter(role => roles.includes(role));

                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            } 
            else if (req.path.includes(accessMatrix.sap.path)) {
                if (accessMatrix.sap.methods.includes(req.method)) {
                    let intersection = accessMatrix.sap.roles.filter(role => roles.includes(role));

                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            }
            else if (req.path.includes(accessMatrix.admin.path)) {
                if (accessMatrix.admin.methods.includes(req.method)) {
                    let intersection = accessMatrix.admin.roles.filter(role => roles.includes(role));

                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            }
            else return res.status(403).json({error: 'Unrecognized path'});
        }
    
        next();
    }
}

module.exports = routeGuard;