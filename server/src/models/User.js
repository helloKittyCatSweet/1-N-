import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'

class User extends Model{}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    sequelize,
    modelName: 'User'
});

export default User;