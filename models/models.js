var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	=	(url[6]||null);
var user	=	(url[2]||null);
var pwd		=	(url[3]||null);
var protocol=	(url[1]||null);
var dialect	=	(url[1]||null);
var port	=	(url[5]||null);
var host	=	(url[4]||null);
var storage = 	process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLITE o Postgres:
var sequelize = new Sequelize(DB_name, user, pwd,
						{dialect: protocol,
						 protocol:protocol,
						 port:	  port,
						 host:	  host,
						 storage: storage,	//sólo SQLITE (.end)
						 omitNull:true		//sólo Potsgres}
						}
					);


// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar la definición de la tabla Comments
var comment_path = path.join(__dirname,'comments');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;	//exportar definición de la tabla Quiz
exports.Comment = Comment;

// sequelize.sync() inicializa la tabla de preguntas en DB
sequelize.sync().then(function() {
	//  then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if (count === 0) {	// la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema:		'Humanidades'	
					   });
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema:		'Humanidades'
					   });
			Quiz.create({ pregunta: 'Artilugio volador que su funcionamiento se basa en calentar el aire de su interior y la gente va en una cesta',
						  respuesta: 'Globo',
						  tema:		'Ciencia'
					   });
			Quiz.create({ pregunta: 'Animal que conocemos como mejor amigo del hombre',
						  respuesta: 'Perro',
						  tema:		'Ciencia'
					   })
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});

