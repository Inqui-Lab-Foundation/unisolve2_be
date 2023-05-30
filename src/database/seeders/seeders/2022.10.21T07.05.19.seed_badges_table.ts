import { Migration } from '../umzug';
import { badge } from '../../../models/badge.model';

// you can put some table-specific imports/code here
export const tableName = badge.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await createBadge(sequelize, "Pre Survey Completed",)
	await createBadge(sequelize,"Course Completed")
	await createBadge(sequelize, "The Inspirer", "", "/assets/images/badges/The_Inspirer_Individual_Badge.png")
	await createBadge(sequelize, "The Team Player", "", "/assets/images/badges/The_Team_Player_Individual_Badge.png")
	await createBadge(sequelize, "The Finder", "", "/assets/images/badges/The_Finder_Individual_Badge.png")
	await createBadge(sequelize, "The Explorer", "", "/assets/images/badges/The_Explorer_Individual_Badge.png")
	await createBadge(sequelize, "The Ideator", "", "/assets/images/badges/The_Ideator_Individual_Badge.png")
	await createBadge(sequelize, "The Solver", "", "/assets/images/badges/The_Solver_Individual_Badge.png")
};

async function createBadge(
	sequelize: any,
	name: string,
	desc: string="",
	icon: string = "/assets/images/badges/default.jpg",) {
		const badgeCreated = await badge.create({
			name: name,
			desc: desc,
			icon: icon,
			created_by: 1,
			updated_by: 1,
		})

	return badgeCreated

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