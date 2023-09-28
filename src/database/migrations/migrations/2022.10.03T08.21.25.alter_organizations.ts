import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { type } from 'os';

// you can put some table-specific imports/code here
export const tableName = "organizations";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`ALTER TABLE organizations MODIFY COLUMN [status enum(${Object.values(constents.organization_status_flags.list)}) DEFAULT ${ constents.organization_status_flags.default }]`);
	await sequelize.getQueryInterface().changeColumn(tableName, 'status', {
		type: DataTypes.ENUM(...Object.values(constents.organization_status_flags.list)),
		defaultValue: constents.organization_status_flags.default
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName, 'status', {
		type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'DELETED', 'LOCKED'),
		defaultValue: 'ACTIVE'
	});
};

