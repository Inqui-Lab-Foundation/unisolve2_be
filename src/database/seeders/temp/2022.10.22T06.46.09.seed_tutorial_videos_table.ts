import { Migration } from '../umzug';
import { badge } from '../../../models/badge.model';
import { tutorial_video } from '../../../models/tutorial_video.model';

// you can put some table-specific imports/code here
export const tableName = tutorial_video.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await createTutorialVideo(sequelize,"Pre Survey Completed")
	await createTutorialVideo(sequelize,"Course Completed")
};

async function createTutorialVideo(
	sequelize: any,
	video_stream_id: string,
	title: string="",
	desc: string="") {
		const badgeCreated = await tutorial_video.create({
			video_stream_id: video_stream_id,
			title: title,
			desc: desc,
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