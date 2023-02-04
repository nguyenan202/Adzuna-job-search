import { Row } from "antd"
import { useSelector } from "react-redux"
import { useState } from "react"

import NavSetting from "./NavSetting"
import MainSetting from "./MainSetting"
import useMediaQuery from '../../hooks/useMediaQuery'
import PermissionsSetting from "./MainSetting/PermissionsSetting"
import CompanySetting from "./MainSetting/CompanySetting"

const Setting = () => {

    const [currentSettingIndex, setCurrentSettingIndex] = useState(0);
    const user = useSelector(state => state.user)

    const renders = [<PermissionsSetting />, <CompanySetting />]

    const canAccess = user.UserPermissions.find(p => p.Permission.path === 'setting') && user.Role.id === 1

    const breakPointTablet = useMediaQuery('(min-width: 992px)')
    
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
                    renders={renders}
                    layout={breakPointTablet ? 16 : 24}
                />
            </Row> :
            <Row>
                Access Denide
            </Row>)
    )
}

export default Setting