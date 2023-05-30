import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "organizations";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().createTable(tableName, {
		organization_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		organization_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		organization_code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		city: {
			type: DataTypes.STRING
		},
		district: {
			type: DataTypes.STRING
		},
		state: {
			type: DataTypes.STRING
		},
		country: {
			type: DataTypes.STRING
		},
		principal_name: {
			type: DataTypes.STRING
		},
		principal_mobile: {
			type: DataTypes.STRING
		},
		principal_email: {
			type: DataTypes.STRING
		},
		status: {
			type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
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
	await sequelize.getQueryInterface().addIndex(tableName, ['organization_code'])
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