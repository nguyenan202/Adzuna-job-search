import { Row } from "antd"
import { useSelector } from "react-redux"
import { useState } from "react"

import NavSetting from "./NavSetting"
import MainSetting from "./MainSetting"
import useMediaQuery from '../../hooks/useMediaQuery'
import PermissionsSetting from "./MainSetting/PermissionsSetting"
import CompanySetting from "./MainSetting/CompanySetting"
import RoleSetting from "./MainSetting/RoleSetting"
import PostSetting from "./MainSetting/PostSetting"

const Setting = () => {

    const [currentSettingIndex, setCurrentSettingIndex] = useState(0);
    const user = useSelector(state => state.user)

    const renders = [
        {
            id: 1,
            render: <PermissionsSetting />
        },
        {
            id: 2,
            render: <CompanySetting />
        },
        {
            id: 3,
            render: <RoleSetting/>
        },
        {
            id: 4,
            render: <PostSetting/>
        }
    ]
    
    const idsCanAccess = user.Role.UserSettingPermissions.map(sp => sp.SettingPermission.id);
    
    const canAccess = user.UserPermissions.find(p => p.Permission.path === 'setting') && idsCanAccess.length > 0

    const breakPointTablet = useMediaQuery('(min-width: 992px)');
    
    return (
        (canAccess ?
            <Row
                style={{
                    minHeight: 'calc(100vh - 66px)'
                }}
            >
                <NavSetting
                    user={user}
                    currentSettingIndex={currentSettingIndex}
                    setCurrentSettingIndex={setCurrentSettingIndex}
                    layout={breakPointTablet ? 8 : 0}
                />
                <MainSetting
                    user={user}
                    currentSettingIndex={currentSettingIndex}
                    setCurrentSettingIndex={setCurrentSettingIndex}
                    renders={renders.filter(component => idsCanAccess.includes(component.id))}
                    layout={breakPointTablet ? 16 : 24}
                />
            </Row> :
            <Row>
                Access Denide
            </Row>)
    )
}

export default Setting