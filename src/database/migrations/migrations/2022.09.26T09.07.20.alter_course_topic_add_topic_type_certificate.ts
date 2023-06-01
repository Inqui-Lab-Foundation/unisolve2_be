import { Migration } from '../umzug';
import { col, DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "course_topics";
export const tableNameMentors = "mentor_course_topics";
export const collumnName = "topic_type";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().changeColumn(tableName,collumnName, {
		type: DataTypes.ENUM(...Object.values(constents.topic_type_flags.list)),
		allowNull: false,
		defaultValue:constents.topic_type_flags.default
            
	  });

	await sequelize.getQueryInterface().changeColumn(tableNameMentors,collumnName, {
	type: DataTypes.ENUM(...Object.values(constents.topic_type_flags.list)),
	allowNull: false,
	defaultValue:constents.topic_type_flags.default
		
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface()
	.changeColumn(tableName, collumnName, {
	  type: DataTypes.ENUM('VIDEO', 'QUIZ', 'WORKSHEET','ATTACHMENT'),
	  allowNull: false,
	  defaultValue:constents.topic_type_flags.default
	});

	await sequelize.getQueryInterface()
	.changeColumn(tableNameMentors, collumnName, {
	  type: DataTypes.ENUM('VIDEO', 'QUIZ', 'WORKSHEET','ATTACHMENT'),
	  allowNull: false,
	  defaultValue:constents.topic_type_flags.default
	});
};