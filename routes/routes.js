var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');

/* GET home page. */
router.get('/', controllers.homeController.index);

router.get("/VerAlimentos", controllers.userController.getVerTA);
router.get("/Ver/:id", controllers.userController.getAli);
router.get("/Login", controllers.userController.getLogin);
router.post("/Login/SignIn", controllers.userController.postSignIn);
router.post("/Login/SignInNutri", controllers.userController.postSignInNutri);
router.post("/Login/v", passport.authenticate('local', {
	successRedirect : '/Check/Usuario',
	failureRedirect : '/Login',
	failureFlash : true 
}));
router.get("/Check/Usuario", controllers.userController.verUsuario);
router.get("/Paciente/Logout", controllers.userController.logout);
router.get('/Paciente', AuthMiddleware.isLoggedAsP ,controllers.userController.getUserPanel);
router.get('/PacienteCitas', AuthMiddleware.isLoggedAsP ,controllers.userController.getCitasP);
router.get('/PacienteUpdate', AuthMiddleware.isLoggedAsP ,controllers.userController.getUpdateP);
router.post("/Paciente/Calc", controllers.userController.calcula);
router.get("/Nutriologo", AuthMiddleware.isLoggedAsN, controllers.userController.getNutriPanel);
router.get("/Citas", AuthMiddleware.isLoggedAsN, controllers.userController.getNutriCitas);
router.get("/Alimentos", AuthMiddleware.isLoggedAsN, controllers.userController.getRegAli);
router.post("/Nutriologo/RegCita", controllers.userController.postRegCita);
router.post("/Nutriologo/RegAli", controllers.userController.postRegAli);
module.exports = router;
