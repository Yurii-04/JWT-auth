import {DataTypes} from 'sequelize';
import sequelize from '../db.js';

const userModel = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            defaultValue: 'user',
        },
        hashed_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activation_link: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
    },
);

export default userModel;