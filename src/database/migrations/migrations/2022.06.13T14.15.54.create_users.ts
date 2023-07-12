import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { user } from '../../../models/user.model';
// you can put some team-specific imports/code here to be included in every migration

const tableName = user.modelTableName;
const tableStructrue = {
  user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  username: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  full_name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
      // select: false
  },
  status: {
      type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
      defaultValue: constents.common_status_flags.default
  },
  role: {
      type: DataTypes.ENUM(...Object.values(constents.user_role_flags.list)),
      defaultValue: constents.user_role_flags.default
  },
  is_loggedin: {
      type: DataTypes.ENUM(...Object.values(constents.common_yes_no_flags.list)),
      defaultValue: constents.common_yes_no_flags.default
  },
  last_login: {
      type: DataTypes.DATE
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
}
export const up: Migration = async ({ context: sequelize }) => {

  const transaction = await sequelize.getQueryInterface().sequelize.transaction();
  try{
      await sequelize.getQueryInterface().createTable(tableName, tableStructrue);
    //   await sequelize.getQueryInterface().addIndex(tableName, ['username'], { name: 'IDX_USR_UN',transaction });
    //   await sequelize.getQueryInterface().addIndex(tableName, ['username'], { name: 'IDX_USR_UN',transaction });

      await transaction.commit();
  }catch(err){
      await transaction.rollback();
      throw err;
  }
    
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