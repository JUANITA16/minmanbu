const routeGuard = (accessMatrix) => {
    return (req, res, next) => {
        console.log("Validate auth")
        if (req.authInfo.roles === undefined) return res.status(403).json({error: 'No roles found!'});
        else {
            const roles = req.authInfo.roles;

            if (req.path.includes(accessMatrix.massive_cc.path)) {
                if (accessMatrix.massive_cc.methods.includes(req.method)) {
                    let intersection = accessMatrix.massive_cc.roles.filter(role => roles.includes(role));

                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            } 
            else if (req.path.includes(accessMatrix.massive_cdt.path)) {
                if (accessMatrix.massive_cdt.methods.includes(req.method)) {
                    let intersection = accessMatrix.massive_cdt.roles.filter(role => roles.includes(role));

                    if (intersection.length < 1) return res.status(403).json({error: 'User not allowed'});
                } 
                else return res.status(403).json({error: 'Action not allowed'});
            }
            else if (req.path.includes(accessMatrix.table.path)) {
                if (accessMatrix.table.methods.includes(req.method)) {
                    let intersection = accessMatrix.table.roles.filter(role => roles.includes(role));

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
            else return res.status(403).json({error: 'Unrecognized path'});
        }
    
        next();
    }
}

module.exports = routeGuard;