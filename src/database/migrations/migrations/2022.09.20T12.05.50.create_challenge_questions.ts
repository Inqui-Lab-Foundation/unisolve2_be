import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "challenge_questions";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, {
		challenge_question_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		challenge_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		question_no: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		question: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		option_a: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		option_b: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		option_c: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		option_d: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		correct_ans: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM(...Object.values(constents.quiz_question_type_flags.list)),
			allowNull: false,
			defaultValue: constents.quiz_question_type_flags.default
		},
		status: {
			type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
			allowNull: false,
			defaultValue: constents.common_status_flags.default
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.NOW,
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.NOW,
			onUpdate: new Date().toLocaleString()
		}
	});
};

export const down: Migration = async ({ context: sequelize }) => {
    // await sequelize.getQueryInterface().dropTable(tableName);
	try {
		await sequelize.transaction(async (transaction) => {
		  const options = { transaction };
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		  await sequelize.query(`DROP TABLE ${tableName}`, options);
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		});
} catch (error) {
	throw error	  
}
};