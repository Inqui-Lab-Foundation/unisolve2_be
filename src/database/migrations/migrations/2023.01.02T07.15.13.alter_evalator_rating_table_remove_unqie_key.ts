import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { evaluator_rating } from '../../../models/evaluator_rating.model';

export const tableName = evaluator_rating.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeIndex(tableName, "challenge_response_id");
	await sequelize.getQueryInterface().addIndex(tableName, ["challenge_response_id", 'evaluator_id'], {
		name: "combine_unique_keys",
		unique: true
	})
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().addIndex(tableName, ["challenge_response_id"]);
		await sequelize.getQueryInterface().removeIndex(tableName, ["challenge_response_id", 'evaluator_id'], {
			name: "unique_key_keys",
			unique: true
		})
	} catch (error) {
		throw error
	}
};