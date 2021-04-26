module.exports = {

	index : function(req, res, next){
		res.render('home', {
			title: "Nutri2",
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});			
	}
}