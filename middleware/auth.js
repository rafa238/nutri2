module.exports = {

	isLogged : function(req, res, next){
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/Login');
		}
	},
	isLoggedAsN : function(req, res, next){
		if(req.isAuthenticated() && req.user.idTiU === 1){
			next();
		}else{
			req.logout();
			res.redirect('/Login');
		}
	},

	isLoggedAsP : function(req, res, next){
		if(req.isAuthenticated() && req.user.idTiU === 2){
			next();
		}else{
			req.logout();
			res.redirect('/Login');
		}
	}

}