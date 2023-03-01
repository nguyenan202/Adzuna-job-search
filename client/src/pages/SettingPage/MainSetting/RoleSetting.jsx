import { Button, Checkbox, Col, Row, Select, Skeleton, Typography, notification, theme } from "antd"
import useMediaQuery from "../../../hooks/useMediaQuery";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ModalCreateRole from "../../../components/ModalCreateRole";
import styles from './styles.module.scss';
import { socket } from '../../../App';

const RoleSetting = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSub, setIsLoadingSub] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [settingPermissions, setSettingPermissions] = useState([]);
    const [currentSettingPermission, setCurrentSettingPermission] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [keyRerender, setKeyRerender] = useState(0);

    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;

    const breakPointTablet = useMediaQuery('(max-width: 768px)');

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 2
        });
    };

    useEffect(() => {
        const fetching = async () => {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const responseSettingPermissions = await axios.get(`${process.env.REACT_APP_API_URL}/setting-permission`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setRoles(response.data);
            setSettingPermissions(responseSettingPermissions.data);
            setIsLoading(false);
        }

        fetching();

        socket.on('updated-role', () => {
            setTimeout(() => {
                setKeyRerender(keyRerender + 1);
                setSelectedRoleId(null);
                setShowSaveBtn(false);
            }, 2000)
        })

        return () => socket.off('updated-role')
    }, [keyRerender])

    useEffect(() => {
        const fetchingPermission = async () => {
            setIsLoadingSub(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/setting-permission/${selectedRoleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setCurrentSettingPermission(response.data.map(sp => sp.id));
            setIsLoadingSub(false);
        }


        fetchingPermission();
        setShowSaveBtn(false);
    }, [selectedRoleId])

    const handleCheckbox = (settingPermissionId) => {
        let cloneCurrentSettingPermission = [...currentSettingPermission];

        cloneCurrentSettingPermission.includes(settingPermissionId) ?
            cloneCurrentSettingPermission = cloneCurrentSettingPermission.filter(sp => sp !== settingPermissionId) :
            cloneCurrentSettingPermission.push(settingPermissionId)

        setCurrentSettingPermission(cloneCurrentSettingPermission);
        setShowSaveBtn(true);
    }

    const allSettingPermission = settingPermissions.map(sp => (
        <Col span={!breakPointTablet ? 12 : 24} style={{ padding: '1rem' }} key={sp.id}>
            <Checkbox
                checked={currentSettingPermission.includes(sp.id)}
                onClick={() => handleCheckbox(sp.id)}
            >
                {sp.name}
            </Checkbox>
        </Col>
    ))

    const allRole = roles && roles.map(role => (
        <Select.Option
            key={role.id}
            value={role.id}
            label={role.name}
        >
            {role.name}
        </Select.Option>
    ))

    const handleSave = async () => {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/setting-permission`, {
            roleId: selectedRoleId,
            data: currentSettingPermission
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        response.data.status ?
            openNotificationWithIcon('success', response.data.message) :
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau')
    }

    return (isLoading ? <Skeleton active /> :
        <Row
            className={styles.sub_container}
            style={{
                width: '100%',
                backgroundColor: themeToken.componentBackground
            }}
        >
            {contextHolder}
            <Row
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <Typography.Title>
                    Chỉnh sửa vai trò
                </Typography.Title>
            </Row>

            <Row
                style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    flexDirection: breakPointTablet && 'column-reverse'
                }}
            >
                <Select
                    style={{
                        width: breakPointTablet ? '100%' : '70%',
                    }}
                    placeholder='Chọn vai trò cần sửa'
                    size="large"
                    onSelect={(roleId) => setSelectedRoleId(roleId)}
                >
                    {allRole}
                </Select>

                <Button
                    size="large"
                    style={{
                        width: breakPointTablet ? '100%' : '28%',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        margin: breakPointTablet && '1rem 0'
                    }}
                    onClick={() => setShowModal(true)}
                >
                    Thêm vai trò
                </Button>
            </Row>

            {selectedRoleId && <Row
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderTop: '1px solid rgb(204, 204, 204)'
                }}
            >

                {isLoadingSub ? <Skeleton active /> : allSettingPermission}
            </Row>}

            {showSaveBtn && <Row
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem',
                    borderTop: '1px solid rgb(204, 204, 204)'
                }}
            >
                <Button
                    size="large"
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        width: breakPointTablet && '100%'
                    }}
                    onClick={handleSave}
                >
                    Lưu thay đổi
                </Button>
            </Row>}


            {/* Modal create new Role */}
            <ModalCreateRole
                isShow={showModal}
                setIsShow={setShowModal}
                settingPermissions={settingPermissions}
            />
        </Row>
    )
}

export default RoleSetting;