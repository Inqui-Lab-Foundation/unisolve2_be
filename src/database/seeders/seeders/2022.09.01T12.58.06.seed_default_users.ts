import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "users";
export const up: Migration = async ({ context: sequelize }) => {
	//admin
	const admin = await adminUser(sequelize,
		"Admin@unisolve.org",
		"default Admin User fullName",
		"$2a$10$iXP5unZT6syNFAlPYvzoPugOu7xSh7e2by9yJACJg.pdYGEfo86NG",
		"ADMIN"
	);
	await adminMapping(sequelize, admin, "default User fullName");
	//student
	const student = await studentUser(sequelize,
		"Student@unisolve.org",
		"default Student User fullName",
		"$2a$10$iXP5unZT6syNFAlPYvzoPugOu7xSh7e2by9yJACJg.pdYGEfo86NG",
		"STUDENT"
	);
	await studentMapping(sequelize, student, "default User fullName");
	//mentor
	const mentor = await mentorUser(sequelize,
		"Mentor@unisolve.org",
		"default Mentor User fullName",
		"$2a$10$iXP5unZT6syNFAlPYvzoPugOu7xSh7e2by9yJACJg.pdYGEfo86NG",
		"MENTOR"
	);
	await mentorMapping(sequelize, mentor, "default User fullName", "default", 3);
};

async function adminUser(
	sequelize: any,
	username: any, full_name: any, password: any, role: any
) {
	const result = await sequelize.getQueryInterface().bulkInsert("users",
		[{
			username: username,
			full_name: full_name,
			password: password,
			role: role,
			created_by: 1,
			updated_by: 1,
		}]
	);
	return result
}
async function studentUser(
	sequelize: any,
	username: any, full_name: any, password: any, role: any
) {
	const result = await sequelize.getQueryInterface().bulkInsert("users",
		[{
			username: username,
			full_name: full_name,
			password: password,
			role: role,
			created_by: 1,
			updated_by: 1,
		}]
	);
	return result
}
async function mentorUser(
	sequelize: any,
	username: any, full_name: any, password: any, role: any
) {
	const result = await sequelize.getQueryInterface().bulkInsert("users",
		[{
			username: username,
			full_name: full_name,
			password: password,
			role: role,
			created_by: 1,
			updated_by: 1,
		}]
	);
	return result
}
async function adminMapping(
	sequelize: any, user_id: any, full_name: any,
) {
	const result = await sequelize.getQueryInterface().bulkInsert("admins",
		[{
			user_id: user_id,
			full_name: full_name,
			created_by: 1,
			updated_by: 1,
		}]
	);
	return result
}
async function studentMapping(
	sequelize: any, user_id: any, full_name: any,
) {
	const result = await sequelize.getQueryInterface().bulkInsert("students",
		[{
			user_id: user_id,
			full_name: full_name,
			created_by: 1,
			updated_by: 1,
		}]
	);
	return result
}
async function mentorMapping(
	sequelize: any, user_id: any, full_name: any, qualification: any, reg_status: number
) {
	const result = await sequelize.getQueryInterface().bulkInsert("mentors",
		[{
			user_id: user_id,
			full_name: full_name,
			qualification: qualification,
			reg_status: reg_status,
			created_by: 1,
			updated_by: 1
		}]
	);
	return result
}

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkDelete(tableName, { video_id: { [Op.in]: [1, 2, 3, 4, 5, 6] } }, {});
};