import "dotenv/config";
import { Umzug, SequelizeStorage } from 'umzug';
import database from '../../utils/dbconnection.util'
import fs from 'fs'
import path from 'path'

const sequelize = database;

export const migrator = new Umzug({
	migrations: {
		glob: ['seeders/*.ts', { cwd: __dirname }],
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
	create: {
		folder: 'src/database/seeders/seeders',
		template: (filepath: any) => [
			// read template from filesystem
			[filepath, fs.readFileSync(path.join(__dirname, 'template/sample_seeder.ts')).toString()],
		],
	}
});

export type Migration = typeof migrator._types.migration;