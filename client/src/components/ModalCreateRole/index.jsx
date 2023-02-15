import { Checkbox, Col, Input, Modal, Row, Typography, notification } from "antd";
import { useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import axios from "axios";
import { useSelector } from "react-redux";


const ModalCreateRole = ({ isShow, setIsShow, settingPermissions }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('');
    const [currentSettingPermission, setCurrentSettingPermission] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    const token = useSelector(state => state.token);

    const breakPointTablet = useMediaQuery('(max-width: 768px)');

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 2
        });
    };

    const handleCheckbox = (settingPermissionId) => {
        let cloneCurrentSettingPermission = [...currentSettingPermission];

        cloneCurrentSettingPermission.includes(settingPermissionId) ?
            cloneCurrentSettingPermission = cloneCurrentSettingPermission.filter(sp => sp !== settingPermissionId) :
            cloneCurrentSettingPermission.push(settingPermissionId)

        setCurrentSettingPermission(cloneCurrentSettingPermission);
    }

    const allSettingPermission = settingPermissions.map(sp => (
        <Col span={!breakPointTablet ? 12 : 24} style={{ padding: '1rem' }} key={sp.id}>
            <Checkbox
                onClick={() => handleCheckbox(sp.id)}
            >
                {sp.name}
            </Checkbox>
        </Col>
    ))

    const handleCreate = async () => {
        setIsLoading(true);
        if (!value || value === '') return openNotificationWithIcon('error', 'Vui lòng nhập vai trò để tạo')
        
        const responseCreatedRole = await axios.post(`${process.env.REACT_APP_API_URL}/role`, {
            name: value
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        // Nếu người dùng tạo Role kèm với các quyền truy cập thì xử lý đoạn if() dưới
        if (responseCreatedRole.data.role.id && currentSettingPermission.length !== 0) {
            const responseAddSettingPermission = await axios.post(`${process.env.REACT_APP_API_URL}/setting-permission`, {
                data: currentSettingPermission,
                roleId: responseCreatedRole.data.role.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            responseAddSettingPermission.data.status ?
            openNotificationWithIcon('success', responseAddSettingPermission.data.message) :
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau')
        }

        setIsLoading(false);
        setIsShow(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={<Typography.Title>Tạo vai trò</Typography.Title>}
                open={isShow}
                onCancel={() => setIsShow(false)}
                onOk={handleCreate}
                confirmLoading={isLoading}
            >
                <Input
                    placeholder="Tên vai trò"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <Row>
                    {allSettingPermission}
                </Row>
            </Modal>
        </>
    )
}

export default ModalCreateRole;