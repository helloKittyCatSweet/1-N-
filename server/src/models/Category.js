import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'

class Category extends Model{}

Category.init({
    categoryName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Category'
});

export default Category;