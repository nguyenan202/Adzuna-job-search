import { Op } from 'sequelize';
import { fileURLToPath } from 'url'
import path from 'path';
import bcrypt from 'bcrypt'

import Permission from "../models/permission";
import Role from "../models/role";
import User from "../models/user";
import UserPermission from "../models/userPermission";
import SettingPermission from '../models/settingPermission';
import UserSettingPermission from '../models/userSettingPermission';


const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        User.hasMany(UserPermission, { foreignKey: 'userId' });
        User.belongsTo(Role, { foreignKey: 'roleId' });
        Role.hasMany(UserSettingPermission, { foreignKey: 'roleId' });
        UserSettingPermission.belongsTo(SettingPermission, { foreignKey: 'settingPermissionId' });
        UserPermission.belongsTo(User, { foreignKey: 'userId' });
        Permission.hasMany(UserPermission, { foreignKey: 'permissionId' });
        UserPermission.belongsTo(Permission, { foreignKey: 'permissionId' });


        const user = await User.findOne({
            where: {
                id
            },
            include: [{
                model: UserPermission,
                include: [{
                    model: Permission
                }]
            }, {
                model: Role,
                include: [{
                    model: UserSettingPermission,
                    include: {
                        model: SettingPermission
                    }
                }]
            }]
        });

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const getUserByName = async (req, res) => {
    try {

        const { name } = req.params

        User.hasMany(UserPermission, { foreignKey: 'userId' });
        User.belongsTo(Role, { foreignKey: 'roleId' });

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } }
                ]
            },
            include: [{
                model: Role
            }]
        });


        const resp = users.map(user => {
            const newUser = user.toJSON();
            delete newUser.password;
            delete newUser.roleId;
            delete newUser.RoleId;

            return newUser;
        })

        // delete userResponse.password;
        // delete userResponse.roleId;
        // delete userResponse.RoleId;

        res.status(200).json(resp);
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updateInfomation = async (req, res) => {

    try {
        const {
            userId,
            ...infoUserChange
        } = req.body

        const updatedRow = await User.update(infoUserChange, {
            where: {
                id: userId
            }
        })

        if (updatedRow[0] !== 0) {
            User.hasMany(UserPermission, { foreignKey: 'userId' });
            User.belongsTo(Role, { foreignKey: 'roleId' });
            Role.hasMany(UserSettingPermission, { foreignKey: 'roleId' });
            UserSettingPermission.belongsTo(SettingPermission, { foreignKey: 'settingPermissionId' });
            UserPermission.belongsTo(User, { foreignKey: 'userId' });
            Permission.hasMany(UserPermission, { foreignKey: 'permissionId' });
            UserPermission.belongsTo(Permission, { foreignKey: 'permissionId' });

            const user = await User.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: UserPermission,
                    include: [{
                        model: Permission
                    }]
                }, {
                    model: Role,
                    include: [{
                        model: UserSettingPermission,
                        include: {
                            model: SettingPermission
                        }
                    }]
                }]
            })

            const newUser = user.toJSON();
            delete newUser.password;
            delete newUser.roleId;
            delete newUser.RoleId;

            return res.status(200).json({
                user: newUser
            });
        }

        res.status(500).json({
            message: 'Update error'
        });
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}

const updateImage = async (req, res) => {
    try {
        const {
            userId
        } = req.body;

        const sampleFile = req.files.picture;
        const imageType = sampleFile.mimetype.replace('image/', '');

        const __filename = fileURLToPath(import.meta.url);
        let __dirname = path.dirname(__filename)
        __dirname = __dirname.replace('controllers', 'public\\images')

        const date = new Date().valueOf();
        const picturePath = `${date}.${imageType}`

        const uploadPath = path.join(__dirname, picturePath);

        sampleFile.mv(uploadPath, (err) => {
            if (err) return res.status(409).json({ message: err });
        })

        const updateRow = await User.update({
            picturePath
        }, {
            where: {
                id: userId
            }
        })

        if (updateRow[0] !== 0) {
            User.hasMany(UserPermission, { foreignKey: 'userId' });
            User.belongsTo(Role, { foreignKey: 'roleId' });
            Role.hasMany(UserSettingPermission, { foreignKey: 'roleId' });
            UserSettingPermission.belongsTo(SettingPermission, { foreignKey: 'settingPermissionId' });
            UserPermission.belongsTo(User, { foreignKey: 'userId' });
            Permission.hasMany(UserPermission, { foreignKey: 'permissionId' });
            UserPermission.belongsTo(Permission, { foreignKey: 'permissionId' });

            const user = await User.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: UserPermission,
                    include: [{
                        model: Permission
                    }]
                }, {
                    model: Role,
                    include: [{
                        model: UserSettingPermission,
                        include: {
                            model: SettingPermission
                        }
                    }]
                }]
            })

            const newUser = user.toJSON();
            delete newUser.password;
            delete newUser.roleId;
            delete newUser.RoleId;

            return res.status(200).json({
                user: newUser
            });
        }

        res.status(404).json({
            message: 'Not Found'
        })
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }

}

const deleteImage = async (req, res) => {

    try {
        const { userId } = req.body;

        const updatedRow = await User.update({
            picturePath: 'no_image.png'
        }, {
            where: {
                id: userId
            }
        })

        if (updatedRow[0] !== 0) {
            User.hasMany(UserPermission, { foreignKey: 'userId' });
            User.belongsTo(Role, { foreignKey: 'roleId' });
            Role.hasMany(UserSettingPermission, { foreignKey: 'roleId' });
            UserSettingPermission.belongsTo(SettingPermission, { foreignKey: 'settingPermissionId' });
            UserPermission.belongsTo(User, { foreignKey: 'userId' });
            Permission.hasMany(UserPermission, { foreignKey: 'permissionId' });
            UserPermission.belongsTo(Permission, { foreignKey: 'permissionId' });

            const user = await User.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: UserPermission,
                    include: [{
                        model: Permission
                    }]
                }, {
                    model: Role,
                    include: [{
                        model: UserSettingPermission,
                        include: {
                            model: SettingPermission
                        }
                    }]
                }]
            })

            const newUser = user.toJSON();
            delete newUser.password;
            delete newUser.roleId;
            delete newUser.RoleId;

            return res.status(200).json({
                user: newUser
            });
        }

        res.status(400).json({ message: 'have error' })
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const getPasswordByUserId = async (req, res) => {

    try {
        const { id } = req.params

        const user = await User.findOne({
            where: {
                id
            }
        })

        res.status(200).json({
            password: user.password
        })

    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updatePassword = async (req, res) => {
    try {
        const {
            email,
            password,
            newPassword
        } = req.body

        const user = await User.findOne({
            where: {
                email
            }
        })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: 'M???t kh???u kh??ng kh???p.'
            })
        }

        const salt = await bcrypt.genSalt();
        const passwordBcrypt = await bcrypt.hash(newPassword, salt);

        const updatedRow = await User.update({
            password: passwordBcrypt
        }, {
            where: {
                email
            }
        })

        if (updatedRow[0] !== 0) {
            return res.status(200).json({
                status: true,
                message: '?????i m???t kh???u th??nh c??ng.'
            })
        }

        res.status(400).json({
            status: false,
            message: 'C?? l???i vui l??ng th??? l???i sau.'
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export {
    getUserById,
    getUserByName,
    updateInfomation,
    updateImage,
    deleteImage,
    getPasswordByUserId,
    updatePassword
}