import SettingPermission from "../models/settingPermission";
import UserSettingPermission from '../models/userSettingPermission';
import { io } from '../index';

const getAllSettingPermission = async (req, res) => {

    try {
        const data = await SettingPermission.findAll();

        res.status(200).json(data);
    }catch(err) {
        res.status(500).json({ message: err });
    }
}

const getAllSettingPermissionByRoleId = async (req, res) => {
    
    try {
        const {
            roleId
        } = req.params;
        
        UserSettingPermission.belongsTo(SettingPermission, { foreignKey: 'settingPermissionId' });
        const data = await UserSettingPermission.findAll({
            where: {
                roleId
            },
            include: {
                model: SettingPermission
            }
        })

        res.status(200).json(data.map(sp => sp.SettingPermission));
    }catch(err) {
        res.status(500).json({ message: err });
    }
}

const createSettingPermissions = async (req, res) => {
    try {
        const {
            data,
            roleId
        } = req.body

        for(let settingPermissionId of data) {
            await UserSettingPermission.create({
                settingPermissionId,
                roleId
            })
        }

        res.status(200).json({
            status: true,
            message: 'Tạo vai trò thành công'
        })
    }catch(err) {
        res.status(500).json({
            message: err
        })
    }
}

const updateSettingPermission = async (req, res) => {
    try {
        const {
            roleId,
            data
        } = req.body

        const allUSP = (await UserSettingPermission.findAll({
            where: {
                roleId
            }
        })).map(usp => usp.settingPermissionId)

        // Xóa những RoleSettingPermission k được chọn
        for(let settingPermissionId of allUSP) {
            !data.includes(settingPermissionId) && await UserSettingPermission.destroy({
                where: {
                    roleId,
                    settingPermissionId
                }
            })
        }

        for (let settingPermissionId of data) {
            !allUSP.includes(settingPermissionId) && await UserSettingPermission.create({
                roleId,
                settingPermissionId
            })
        }

        io.emit(`updated-roleId-${roleId}`)

        res.status(200).json({
            status: true,
            message: 'Cập nhật vai trò thành công'
        })
    }catch(err) {
        res.status(500).json({ message: err });
    }
}

export {
    getAllSettingPermission,
    getAllSettingPermissionByRoleId,
    createSettingPermissions,
    updateSettingPermission
}