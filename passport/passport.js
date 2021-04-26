var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = (passport) =>{

	passport.serializeUser(function(user, done){
		done(null, user);
	});

	passport.deserializeUser(function(obj, done){
		done(null, obj);
	});

	passport.use(new LocalStrategy({
		passReqToCallback : true
	}, function(req, userN, password, done){
		
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		db.connect();

		db.query('select * from Usuario where userName =?', userN, function(err, rows, fields){
			if(err) throw err;

			if(rows.length > 0){

				var user = rows[0];
				if(user.idTiU == 2){
					db.query("select paciente.idPaciente, usuario.*, DatPaciente.* from ((paciente inner join datPaciente on paciente.idDatP = datPaciente.idDatP) inner join usuario on paciente.idUsuario = usuario.idUsuario) where userName =?", userN,(err2, rows2, fields) =>{
						if(err2) throw err2;
						db.end();
						if(rows2.length > 0){
							user = rows2[0];
							if(bcrypt.compareSync(password, user.passw)){
								return done(null, {
									idU: user.idUsuario,
									idTiU: user.idTiU,
									idPa: user.idPaciente,
									idDatP: user.idDatP,
									nombre: user.nombre,
									email: user.email,
									imc: user.imc,
									tmb: user.tmb
								});
							}
							return done(null, false, req.flash('errorMessage', 'Usuario o Password incorrecto.'));
						}
					});
					
				}else{
					if(user.idTiU == 1){
						db.query("select nutriologo.idNutri, usuario.* from nutriologo inner join usuario on nutriologo.idUsuario = usuario.idUsuario where userName = ?", userN, (err2, rows2, fields) =>{
							if(err2) throw err2;
							db.end();
							if(rows2.length > 0){
								user = rows2[0];
								if(bcrypt.compareSync(password, user.passw)){
									return done(null, {
										idNutri: user.idNutri,
										idU: user.idUsuario,
										idTiU: user.idTiU,
										nombre: user.nombre,
										email: user.email
									});
								}
								return done(null, false, req.flash('errorMessage', 'Usuario o Password incorrecto.'));
							}
						});
						
						
					}
				}
				
			}else{
				return done(null, false, req.flash('errorMessage', 'Usuario o Password incorrecto.'));
			}
		});

	}
	));
};