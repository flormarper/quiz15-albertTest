var models = require('../models/models.js');

// Autoload - factoriza el cóodigo si la ruta incluye :quizId
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


// GET /quizes
//NOta : tambien sirve para --> GET  /quizes?search=texto_a_buscar
exports.index = function(req, res) {
	var search ="%";
	if(req.query.search != undefined){
		search = "%" + req.query.search + "%";
		search = search.trim().replace(/\s/g,"%");
	}

	models.Quiz.findAll({where:["upper(pregunta) like ?", search.toUpperCase()], order:"pregunta"}).then(
		function(quizes){
			res.render('quizes/index.ejs',{ quizes: quizes});
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/search
exports.searcher = function(req, res){
	res.render('quizes/search',{ title: 'Busqueda' })
};

// hacer buscador
//   GET  /quizes?search=texto_a_buscar
