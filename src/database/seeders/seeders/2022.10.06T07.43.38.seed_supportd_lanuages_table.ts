import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { supported_language } from '../../../models/supported_language.model';

// you can put some table-specific imports/code here
export const tableName = supported_language.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await createSupportedLanguage(sequelize,"en")
	await createSupportedLanguage(sequelize,"tn")
	await createSupportedLanguage(sequelize,"hi")
};

async function createSupportedLanguage(
	sequelize: any,
	locale: string) {
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert(tableName, [{
			locale: locale,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	try {
		await sequelize.transaction(async (transaction) => {
		  const options = { transaction };
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		  await sequelize.query(`TRUNCATE TABLE ${tableName}`, options);
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		});
	  } catch (error) {
		console.log(error);
	  }
};