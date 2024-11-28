import {DataTypes} from 'sequelize';
import sequelize from '../db.js';

const tokenModel = sequelize.define('tokens', {
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
});

export default tokenModel