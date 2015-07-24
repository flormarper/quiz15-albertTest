//Definición del modelo Quiz

moudule.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz',
			{ pregunta:  DataTypes.STRING,
			  respuesta: DataTypes.STRING,
			});	
}
