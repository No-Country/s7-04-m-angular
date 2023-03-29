import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface UserAttributes {
    nickName ? : string;
    email ? : string;
    password ? : string;
    isActive ? : boolean;

}

export interface UserInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    nickName: string;
    email: string;
    password: string;
    isActive: boolean;

}

export = (sequelize: Sequelize, DataTypes: DataTypes) => {
    var User = sequelize.define('User', {
        nickName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN
    });

    User.associate = function(models) {
        // associations can be defined here
    };

    return User;
};
