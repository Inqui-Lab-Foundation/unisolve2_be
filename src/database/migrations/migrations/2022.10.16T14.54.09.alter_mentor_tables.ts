import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { speeches } from '../../../configs/speeches.config';

// you can put some table-specific imports/code here
export const tableName = "mentors";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName, 'mobile', {
		type: DataTypes.STRING,
		unique: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().dropTable(tableName);
};