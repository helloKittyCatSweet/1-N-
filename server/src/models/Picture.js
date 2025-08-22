import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'

class Picture extends Model{}

Picture.init({
    picCateId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    savePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    like: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Picture'
});

export default Picture;