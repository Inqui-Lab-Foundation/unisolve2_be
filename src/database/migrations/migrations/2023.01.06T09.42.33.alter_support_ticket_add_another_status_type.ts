import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { support_ticket } from '../../../models/support_ticket.model';

export const tableName = support_ticket.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName, 'status', {
		type: DataTypes.ENUM(...Object.values(constents.support_tickets_status_flags.list)),
		defaultValue: constents.support_tickets_status_flags.default
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().changeColumn(tableName, 'status', {
			type: DataTypes.ENUM("OPEN", "INPROGRESS", "RESOLVED", "BLOCKED"),
			defaultValue: constents.support_tickets_status_flags.default
		});
	} catch (error) {
		throw error
	}
};