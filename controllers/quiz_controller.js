var models = require('../models/models.js');

// Autoload - factoriza el cóodigo si la ruta incluye :quizId
/* Anterior  Comentado el 05-08-2015 a las 12:15h
    exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));				
			}
		}
	).catch(function(error) { next(error);});
};
*/

exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
		}).then(
			function(quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} else {
					next(new Error('No existe quizId=' + quizId));				
				}
			}
		).catch(function(error) { next(error);});
};

// GET /quizes
//Nota : tambien sirve para --> GET  /quizes?search=texto_a_buscar
exports.index = function(req, res) {
	var search ="%";
	if(req.query.search != undefined){
		search = "%" + req.query.search + "%";
		search = search.trim().replace(/\s/g,"%");
	}

	models.Quiz.findAll({where:["upper(pregunta) like ?", search.toUpperCase()], order:"pregunta"}).then(
		function(quizes){
			res.render('quizes/index.ejs',{ quizes: quizes, errors: []});
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/search
exports.searcher = function(req, res){
	res.render('quizes/search',{ title: 'Busqueda', errors: []})
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(		//Crea objeto quiz
		{ pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	//Valida los datos de entrada
	quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				//Guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta","tema"]})
					.then(function(){
						res.redirect('/quizes');	
					});//Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

//GET /quizes/:id/edit
exports.edit = function( req, res) {
	var quiz = req.quiz;	//autoload de instancia quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	//Valida los cambios
	req.quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: quiz, errors: err.errors});
			} else {
				//save : guarda en DB los campos pregunta y respuesta 
				req.quiz.save({fields: ["pregunta", "respuesta","tema"]})
					.then(function(){
						res.redirect('/quizes');	
					});//Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(
		function(){
			res.redirect('/quizes');
		}
	).catch(function(error){ next(error)});
};
