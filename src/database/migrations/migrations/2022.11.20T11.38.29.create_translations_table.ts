import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { translation } from '../../../models/translation.model';

// you can put some table-specific imports/code here
export const tableName = translation.modelTableName;
 const structrue:any =  {
	translation_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    table_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
    coloumn_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
    index_no: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	from_locale: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: constents.translations_flags.default_locale
	},
	to_locale: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	key: {
		type: DataTypes.TEXT('long'),
		
	},
	value: {
		type: DataTypes.TEXT('long'),
		
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
};
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().createTable(tableName,structrue);
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