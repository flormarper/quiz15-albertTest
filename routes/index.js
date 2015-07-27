var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});
//Definiciones anteriores:
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer',   quizController.answer);
//
//Definición de rutas de /quiz
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);

router.get('/author', function(req, res) {
  res.render('author', { title: 'Autores' });
});
module.exports = router;
