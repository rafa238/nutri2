var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = {
	getLogin : (req, res, next) =>{
		return res.render("visitante/login", {
			message: req.flash('info'),
			message2: req.flash("infoN"),
			errorMessage: req.flash("errorMessage"),
			title: "Login",
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	},

	postSignIn : (req, res, next) =>{
		console.log(req.body);
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.pass, salt);
		var enfC = req.body.enfC;
		if(enfC.trim() === ""){
			enfC = "Ninguna";
		}

		var sql = "INSERT INTO?? SET?";
		var datU = {
			idTiu: 2, 
			nombre: req.body.Nombre, 
			apellidoP: req.body.App, 
			apellidoM: req.body.Apm,
			tel: req.body.tel, 
			userName: req.body.uName, 
			passw: password, 
			email: req.body.mail, 
			fechaCumple: req.body.fechaC, 
			sexo: req.body.sRadio
		}

		var datDP = {
			peso: req.body.Peso, 
			altura: req.body.Altura, 
			enfC: enfC
		}

		

		var insertDatU = ['usuario', datU];
		var insertDatDP = ['DatPaciente', datDP];

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.beginTransaction((err) =>{
			if(err){throw err;}
			db.query(sql, insertDatU, (error, results, fields) =>{
				if(error){
					return db.rollback(() =>{
						throw error;
					});
				}

				var _idUs = results.insertId;
				console.log("idUsuario", _idUs);

				db.query(sql, insertDatDP, (error, results2, fields) =>{
					if (error){
						return db.rollback(() =>{
							throw error;
						});
					}

					var _idDatPa = results2.insertId;
					console.log("idDatosP", _idDatPa);

					var datP = {
						idUsuario: _idUs,
						idDatP: _idDatPa
					}
					var insertDatP = ['Paciente', datP];


					db.query(sql, insertDatP, (error, results3, fields) =>{
						if (error){
							return db.rollback(() =>{
								throw error;
							});
						}
						var _idP = results3.insertId;
						db.commit((err) =>{
							if(err){
								return db.rollback(() =>{
									throw err;
								});
							}
							console.log("idPaciente", _idP);
							console.log("Paciente Registrado Correctamente")
							db.end();
						});
					});
				});
			});
		});
		req.flash('info', 'Se ha registrado correctamente, ya puede iniciar sesion');
		return res.redirect("/Login");
	},

	getUserPanel : (req, res, next) =>{
		var idDatP = req.user.idDatP; 
		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query("select * from datPaciente where idDatP =?", idDatP, (err, rows, fields) =>{
			if(err) throw err;
			db.end();
			var datP = {
				idDatP : rows[0].idDatP,
				peso : rows[0].peso,
				altura : rows[0].altura,
				imc : rows[0].imc,
				tmb : rows[0].tmb,
				enfC : rows[0].enfC
			}; 
			console.log(req.user);
			console.log(datP);
			return res.render('paciente/panel', {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				title: "Home Paciente"
			});
		});
		
	},

	logout : (req, res, next) =>{
		req.logout();
		res.redirect("/");
	},

	getNutriPanel : (req, res, next) =>{
		console.log(req.user);
		res.render("nutri/panelN", {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			title: "Home Nutriologo"
		})
	},
	verUsuario : (req, res, next) =>{
		console.log(req.user);
		var idTiU = req.user.idTiU;
		console.log(idTiU);
		if(idTiU == 1){
			console.log("Es nutri");
			return res.redirect("/Nutriologo");
		}else{
			if(idTiU == 2){
				console.log("Es paciente");
				return res.redirect("/Paciente");
			}
		}
	},
	calcula : (req, res, next) =>{
		var sql = "select paciente.idPaciente, usuario.fechaCumple, usuario.sexo, DatPaciente.* from ((usuario inner join paciente on usuario.idUsuario = paciente.idUsuario) inner join datPaciente on paciente.idDatP = datPaciente.idDatP) where Usuario.idUsuario =?";
		var sql2 = "update DatPaciente set?? where idDatP =?";
		var idUsuario = req.user.idU;
		var actFi = req.body.AFRadios;

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.beginTransaction((err) =>{
			if(err){throw err;}
			db.query(sql, idUsuario, (error, results, fields) =>{
				if(error){
					return db.rollback(() =>{
						throw error;
					});
				}
				var hoy = new Date();
				var paciente = results[0];
				console.log(paciente);
				var idDatP = paciente.idDatP;
				var peso = paciente.peso;
				var altura = paciente.altura;
				var _imc = paciente.imc;
				var _tmb = paciente.tmb;
				var fechaC = paciente.fechaCumple;
				var cumpleanos = new Date(fechaC);
				var sexo = paciente.sexo;
			    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
			    var m = hoy.getMonth() - cumpleanos.getMonth();

			    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
			        edad--;
			    }
				console.log(edad);
				console.log(peso);
				console.log(altura);
				console.log(sexo);
				_imc = (peso)/((altura/100)*(altura/100));
				console.log(_imc);
				console.log(actFi);
				if(sexo == "Masculino"){
					_tmb = ((10*peso) + (6.5*altura) - (5*edad) + 5)*actFi;
				}else{
					_tmb = ((10*peso) + (6.5*altura) - (5*edad) - 161)*actFi;
				}
				console.log(_tmb);

				var newDatP = {
					imc: _imc,
					tmb: _tmb
				};
				console.log(newDatP);
				var insertNDatP = [newDatP, idDatP];
				console.log(insertNDatP);

				db.query("update DatPaciente set imc=" + mysql.escape(_imc) + ", tmb=" + mysql.escape(_tmb) + " where datPaciente.idDatP =" + mysql.escape(idDatP) + ";",(error, results2, fields) =>{
					if(error){
						return db.rollback(() =>{
							throw error;
						});
					}
					db.commit((err) =>{
						if(err){
							return db.rollback(() =>{
								throw err;
							});
						}
						db.end();
					});		
					return res.redirect("/Paciente/Logout");
				});

			});
		});
		
	},
	postSignInNutri : (req, res, next) =>{
		console.log(req.body);
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.passwordN, salt);
		var sql = "INSERT INTO?? SET?";
		var datU = {
			idTiu: 1, 
			nombre: req.body.nombreN, 
			apellidoP: req.body.apellidoPN, 
			apellidoM: req.body.apellidoMN,
			tel: req.body.telN, 
			userName: req.body.userNameN, 
			passw: password, 
			email: req.body.emailN, 
			fechaCumple: req.body.fechaCN, 
			sexo: req.body.sRadioN
		}

		var insertDatU = ['usuario', datU];

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.beginTransaction((err) =>{
			if(err){throw err;}
			db.query(sql, insertDatU, (error, results, fields) =>{
				if(error){
					return db.rollback(() =>{
						throw error;
					});
				}

				var _idUs = results.insertId;
				console.log("idUsuario", _idUs);

				var datN = {
					idUsuario: _idUs,
					cedula: req.body.Cedula
				}
				var insertDatN = ['Nutriologo', datN];
				db.query(sql, insertDatN, (error, results2, fields) =>{
					if(error){
						return db.rollback(() =>{
							throw error;
						});
					}
					var _idN = results2.insertId;
					db.commit((err) =>{
						if(err){
							return db.rollback(() =>{
								throw err;
							});
						}
						console.log("idNutriologo", _idN);
						console.log("Nutriologo Registrado Correctamente")
						db.end();
					});
				});
			});
		});
		req.flash('infoN', 'Nutriologo registrado correctamente, ya puede iniciar sesion');
		return res.redirect("/Login");
	},

	getNutriCitas : (req, res, next) =>{
		console.log(req.user);
		var sql = "select paciente.idPaciente, usuario.nombre, usuario.apellidoP, usuario.apellidoM, usuario.email from paciente inner join usuario on paciente.idUsuario = usuario.idUsuario;"
		var sql2 = "select * from Cita where idNutri =?";
		var idNutri = req.user.idNutri;
		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql, (err, results, fields) =>{
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			db.query(sql2, idNutri, (err2, results2, fields) =>{
				if(err2){
					return db.rollback(() =>{
						throw err2;
					});
				}
				db.end();
				console.log(results2);
				return res.render('nutri/citas', {
					isAuthenticated : req.isAuthenticated(),
					user : req.user,
					title: "Citas",
					pacientes: results,
					citas: results2,
					errRCita: req.flash("errCita"),
					exitoCita: req.flash("succesCita")
				});
			});
			
		});
		
	},

	postRegCita : (req, res, next) =>{
		console.log(req.body);
		var _idPaciente = req.body.idPaciente; 
		var sql = "insert into Cita set?";
		var sql2 = "select * from Paciente where idPaciente =?";
		var fechaHora = req.body.fechaHora;
		var fh;
		var res2; 
		var str = "2018/05/17 09:45 pm";
		var resu = fechaHora.split(" ");
		if(resu[2] === 'am'){
			res2 = fechaHora.split(" ", 2);
			var h = res2[1].split(":");
			if(parseInt(h[0]) === 12){
				fh = res2[0] + " " + "00" + ":" + h[1];
			}else{
				fh = res2[0] + " " + res2[1];
			}
			
		}else{
			if(resu[2] === 'pm'){
				res2 = fechaHora.split(" ", 2);
				var h = res2[1].split(":");
				if(parseInt(h[0]) === 12){
					fh = res2[0] + " " + res2[1];
				}else{
					var h1 = parseInt(h[0]) + 12;
					fh = res2[0] + " " + h1 + ":" + h[1];
				}
				
			}
		}
		var datCita = {
			idNutri : req.user.idNutri,
			idPaciente : _idPaciente,
			fechaHora : fh
		};

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql2, _idPaciente, (err, rows, fields) =>{
			if(err) throw err;
			console.log(rows);
			if(rows.length > 0){
				db.query(sql, datCita, (err2, results, fields) =>{
					if(err2){
						return db.rollback(() =>{
							throw err2;
						});
					}
					db.end();
					req.flash('succesCita', 'Cita Registrada Correctamente');
					return res.redirect("/Citas");
					
				});
			}else{
				db.end();
				req.flash('errCita', 'No existe el paciente');
				return res.redirect("/Citas")
			}
		});
	},

	getCitasP : (req, res, next) =>{
		console.log(req.user);
		var sql = "select cita.idCita, usuario.nombre, usuario.apellidoP, usuario.email, cita.fechaHora from ((cita inner join nutriologo on cita.idNutri = nutriologo.idNutri) inner join usuario on nutriologo.idUsuario = usuario.idUsuario) where cita.idPaciente =?";
		var _idPaciente = req.user.idPa;
		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql, _idPaciente, (err, rows, fields) =>{
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			db.end();
			console.log(rows);
			return res.render("paciente/citasP", {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				title: "Citas",
				citas: rows
			})
		});
	},

	getRegAli: (req, res, next) =>{
		var sql = "select * from tipoAli";
		var sql2 = "select Alimentos.nombreA, Alimentos.descri, tipoAli.descTiA, cantidades.* from ((alimentos inner join tipoAli on alimentos.idTipoA = tipoAli.idTipoA) inner join cantidades on alimentos.idCant = cantidades.idCant);";
 		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql, (err, rows, fields) =>{
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			console.log(rows);
			db.query(sql2, (err2, rows2, fields) =>{
				if(err2){
					return db.rollback(() =>{
						throw err2;
					});
				}
				db.end();
				console.log(rows2);
				return res.render("nutri/registraA", {
					isAuthenticated : req.isAuthenticated(),
					user : req.user,
					title: "Alimentos",
					tipoAli: rows,
					alimentos: rows2
				});
			});
			
		});
	},

	postRegAli : (req, res, next) =>{
		console.log(req.body);
		var sql = "insert into?? set?";
		var sql2 = "select idTipoA from tipoAli where descTiA =?";

		var nombreA = req.body.nombreA;
		var tipoA = req.body.tipoA;
		var datCant = {
			calorias: req.body.cal,
			proteinas: req.body.prote,
			hidratos: req.body.hail,
			grasas: req.body.grasa,
			indiceG: req.body.ig,
			salesMine: req.body.salesM,
			vitamins: req.body.vitmns,
		};
		var descriA = req.body.desc;

		var insertCant = ["Cantidades", datCant];

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.beginTransaction((err) =>{
			if(err){throw err;};

			db.query(sql2,tipoA, (error, results, fields) =>{
				if(error){
					return db.rollback(() =>{
						throw error;
					});
				}
				console.log(results);
				var result = results[0];
				console.log(result.idTipoA);
				var idTiA = result.idTipoA;
				db.query(sql, insertCant, (error2, results2, fields) =>{
					if(error2){
						return db.rollback(() =>{
							throw error2;
						});
					}

					var idCant = results2.insertId;
					var datAli = {
						nombreA: nombreA,
						idTipoA: idTiA,
						idCant: idCant,
						descri: descriA
					};
					var insertAli = ["Alimentos", datAli];

					db.query(sql, insertAli, (error3, results3, fields) =>{
						if (error3){
							return db.rollback(() =>{
								throw error3;
							});
						}
						db.commit((err) =>{
							if(err){
								return db.rollback(() =>{
									throw err;
								});
							}
							console.log("Alimento Registrado Correctamente")
							db.end();
							return res.redirect("/Alimentos");
						});

					});
				});
			});
		});
	},
	getVerTA : (req, res, next) =>{
		var sql = "select * from tipoAli";
		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql, (err, rows, fields) =>{
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			db.end();
			return res.render("alimentosGallery", {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				title: "Tipos de Alimentos",
				tipoAli: rows
			});
		});
	},

	getAli : (req, res, next) =>{
		const { id } = req.params;
		var sql = "select Alimentos.nombreA, Alimentos.descri, tipoAli.descTiA, cantidades.* from ((alimentos inner join tipoAli on alimentos.idTipoA = tipoAli.idTipoA) inner join cantidades on alimentos.idCant = cantidades.idCant) where alimentos.idTipoA =?";
		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});
		db.query(sql, [id], (err, rows) => {
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			db.end();
			return res.render('alimentos', {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				title: "Alimentos",
		    	alimentos: rows
		  	});
		});
	},

	getUpdateP : (req, res, next) =>{
		console.log(req);
		var idU = req.user.idU;
		var sql = "select * from Usuario where idUsuario=?"

		var config = require(".././database/config");

		var db = mysql.createConnection(config);

		db.connect((error) =>{
			if (error) {
				console.log("No se conectó con la Base", error);
			} else {
				console.log("Éxito");
			}
		});

		db.query(sql, idU, (err, rows, fields) =>{
			if(err){
				return db.rollback(() =>{
					throw err;
				});
			}
			db.end();
			var _pacient = rows[0];
			console.log(_pacient);
			return res.render('paciente/update', {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				title: "Actualizar Datos",
		    	pacient: _pacient
			});
		});
	}
}