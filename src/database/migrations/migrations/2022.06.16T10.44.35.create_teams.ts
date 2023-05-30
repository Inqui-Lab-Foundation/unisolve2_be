import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { team } from '../../../models/team.model';

const tableName = team.modelTableName;
const tableStructre = {
    team_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    team_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mentor_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
}
export const up: Migration = async ({ context: sequelize }) => {
    const transaction = await sequelize.getQueryInterface().sequelize.transaction();
  try{
      await sequelize.getQueryInterface().createTable(tableName, tableStructre);
    //   await sequelize.getQueryInterface().addIndex(tableName, ['mentor_id'], { name: 'FK_TEAMS_MENTID',transaction });

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