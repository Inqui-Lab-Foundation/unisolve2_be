import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "name_of_your_table";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	const transaction = await sequelize.getQueryInterface().sequelize.transaction();
	try {
		//users table 
		await sequelize.getQueryInterface().addIndex("users", ['username'], {
			name: 'IDX_USR_UN',
			unique: true,
			transaction
		});

		//teams table
		await sequelize.getQueryInterface().addIndex("teams", ['mentor_id', "team_name"], {
			name: 'UNQ_TEAM_NAME',
			unique: true,
			transaction
		});

		//challenge questions table
		await sequelize.getQueryInterface().addIndex("challenge_questions", ['question_no'], {
			name: 'IDX_CHALQ_QNO',
			unique: false,
			transaction
		});

		//challenge response table
		await sequelize.getQueryInterface().addIndex("challenge_responses", ['challenge_id'], {
			name: 'FK_CHALRES_CHALID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("challenge_responses", ['team_id'], {
			name: 'FK_CHALRES_TEAMID',
			unique: false,
			transaction
		});



		//course topics table
		await sequelize.getQueryInterface().addIndex("course_topics", ['topic_type_id'], {
			name: 'FK_MCTOP_TOPTYPID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("course_topics", ['topic_type'], {
			name: 'FK_MCTOP_TOPTYP',
			unique: false,
			transaction
		});
		// await sequelize.getQueryInterface().addIndex("course_topics", ['topic_type'], { name: 'IDX_CTOP_CTOPTYPE', transaction });
		// await sequelize.getQueryInterface().addIndex("course_topics", ['topic_type_id'], { name: 'IDX_CTOP_CTOPTYPEID', transaction });

		//faqs
		await sequelize.getQueryInterface().addIndex("faqs", ['faq_category_id'], {
			name: 'FK_FAQ_FCATID',
			unique: false,
			transaction
		});


		//mentor course topics table
		await sequelize.getQueryInterface().addIndex("mentor_course_topics", ['mentor_course_id'], {
			name: 'FK_MCTOP_MCID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("mentor_course_topics", ['topic_type_id'], {
			name: 'FK_MCTOP_TOPTYPID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("mentor_course_topics", ['topic_type'], {
			name: 'FK_MCTOP_TOPTYP',
			unique: false,
			transaction
		});

		//mentor topic progress table
		await sequelize.getQueryInterface().addIndex("mentor_topic_progress", ['user_id'], {
			name: 'FK_MNTRTOPPROG_USRID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("mentor_topic_progress", ['mentor_course_topic_id'], {
			name: 'FK_MNTRTOPPROG_MCTOPID',
			unique: false,
			transaction
		});


		//mentor table
		await sequelize.getQueryInterface().addIndex("mentors", ['team_id'], {
			name: 'FK_MNTR_TEAMID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("mentors", ['district'], {
			name: 'IDX_MNTR_DSTRCT',
			unique: false,
			transaction
		});

		//notifications table
		await sequelize.getQueryInterface().addIndex("notifications", ['notification_type'], {
			name: 'IDX_NOTIF_NTYPE',
			unique: false,
			transaction
		});
		//organizations table
		// await sequelize.getQueryInterface().addIndex("organizations", ['organization_code'], {
		// 	name: 'organizations_organization_code',
		// 	unique: false,
		// 	transaction
		// });
		await sequelize.getQueryInterface().addIndex("organizations", ['district'], {
			name: 'IDX_ORG_DSTRCT',
			unique: false,
			transaction
		});
		//quiz_questions table
		await sequelize.getQueryInterface().addIndex("quiz_questions", ['question_no'], {
			name: 'IDX_QQSTN_QNO',
			unique: false,
			transaction
		});
		// await sequelize.getQueryInterface().addIndex("quiz_questions", ['quiz_id'], {
		// 	name: 'quiz_id',
		// 	unique: false,
		// 	transaction
		// });
		//quiz_responses table
		// await sequelize.getQueryInterface().addIndex("quiz_responses", ['user_id'], {
		// 	name: 'user_id',
		// 	unique: false,
		// 	transaction
		// });
		// await sequelize.getQueryInterface().addIndex("quiz_responses", ['quiz_id'], {
		// 	name: 'quiz_id',
		// 	unique: false,
		// 	transaction
		// });
		//reflective_quiz_questions table
		await sequelize.getQueryInterface().addIndex("reflective_quiz_questions", ['video_id'], {
			name: 'FK_RQQSTN_VDEOID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("reflective_quiz_questions", ['question_no'], {
			name: 'IDX_RQQSTN_QNO',
			unique: false,
			transaction
		});
		//reflective_quiz_responses table
		await sequelize.getQueryInterface().addIndex("reflective_quiz_responses", ['user_id'], {
			name: 'FK_RQRES_USRID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("reflective_quiz_responses", ['video_id'], {
			name: 'FK_RQRES_VIDID',
			unique: false,
			transaction
		});
		//students
		// await sequelize.getQueryInterface().addIndex("students", ['user_id'], {
		// 	name: 'user_id',
		// 	unique: false,
		// 	transaction
		// });
		await sequelize.getQueryInterface().addIndex("students", ['team_id'], {
			name: 'FK_STU_TEAMID',
			unique: false,
			transaction
		});
		await sequelize.getQueryInterface().addIndex("students", ['district'], {
			name: 'IDX_STU_DSTRCT',
			unique: false,
			transaction
		});

		//support_tickets table
		await sequelize.getQueryInterface().addIndex("support_tickets", ['query_category'], {
			name: 'IDX_SUPTKT_CAT',
			unique: false,
			transaction
		});
		//support_tickets_replies table
		// await sequelize.getQueryInterface().addIndex("support_tickets_replies", ['query_id'], {
		// 	name: 'query_id',
		// 	unique: false,
		// 	transaction
		// });
		//support_tickets_replies table
		await sequelize.getQueryInterface().addIndex("support_tickets_replies", ['support_ticket_id'], {
			name: 'FK_STREPLY_STID',
			unique: false,
			transaction
		});
		//translations table
		await sequelize.getQueryInterface().addIndex("translations", ['to_locale'], {
			name: 'IDX_TRNSL_TLOCALE',
			unique: false,
			transaction
		});
		//user_topic_progress table
		// await sequelize.getQueryInterface().addIndex("user_topic_progress", ['user_id'], {
		// 	name: 'user_id',
		// 	unique: false,
		// 	transaction
		// });
		// await sequelize.getQueryInterface().addIndex("user_topic_progress", [ 'course_topic_id'], {
		// 	name: 'user_id',
		// 	unique: false,
		// 	transaction
		// });
		//video table
		// await sequelize.getQueryInterface().addIndex("videos", ['video_stream_id'], {
		// 	name: 'video_stream_id',
		// 	unique: true,
		// 	transaction
		// });

		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}

};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	// await sequelize.getQueryInterface().dropTable(tableName);
	const transaction = await sequelize.getQueryInterface().sequelize.transaction();
	try {
		// await sequelize.transaction(async (transaction) => {
		//   const options = { transaction };
		//   await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		//   await sequelize.query(`DROP TABLE ${tableName}`, options);
		//   await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		// });
		await sequelize.getQueryInterface().addIndex("translations", ['to_locale'], {
			name: 'IDX_TRNSL_TLOCALE',
			unique: false,
			transaction
		});
		throw Error("not yet implemented")
	} catch (error) {
		throw error;
	}
};