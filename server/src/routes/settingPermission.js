import express from 'express'

import {
    verifyToken
} from '../middlewares/auth';
import {
    getAllSettingPermission,
    getAllSettingPermissionByRoleId,
    createSettingPermissions,
    updateSettingPermission
} from '../controllers/settingPermission';

const router = express.Router();

router.get('/', verifyToken, getAllSettingPermission);
router.get('/:roleId', verifyToken, getAllSettingPermissionByRoleId);

router.post('/', verifyToken, createSettingPermissions);

router.patch('/', verifyToken, updateSettingPermission);

export default router;