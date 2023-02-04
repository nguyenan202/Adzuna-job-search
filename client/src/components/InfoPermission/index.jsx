import { Avatar, Button, Checkbox, Col, Image, Input, Modal, Row, Select, Typography, theme } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"
import { AiFillWarning } from 'react-icons/ai'
import { MdOutlineVerified } from 'react-icons/md'
import { useSelector } from "react-redux";
import FieldInput from "../FieldInput";
import useMediaQuery from "../../hooks/useMediaQuery";


const InfoPermission = ({ user, isLoading, setIsLoading }) => {

    const [messageUpdate, setMessageUpdate] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(user.Role.id);
    const [roles, setRoles] = useState([]);
    const [currentPermissions, setCurrenetPermissions] = useState(user.UserPermissions.map(userPermission => userPermission.Permission));
    const [permissions, setPermissions] = useState([]);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const breakPointTablet = useMediaQuery('(min-width: 572px)')

    useEffect(() => {
        setCurrentRole(user.Role.id);
        setCurrenetPermissions(user.UserPermissions.map(userPermission => userPermission.Permission));

        roles.length !== 0 && setIsLoading(false);
    }, [user.id])

    useEffect(() => {

        const fetchData = async () => {
            const response_1 = await axios(`${process.env.REACT_APP_API_URL}/permission`);

            
            const response_2 = await axios(`${process.env.REACT_APP_API_URL}/role`);
            
            
            setPermissions(response_1.data);
            setRoles(response_2.data);
            
            setIsLoading(false);
        }

        fetchData();
    }, [])


    const handleChangeCheckbox = (e, permission) => {
        let newCurrentPermissions = [...currentPermissions];

        if (e.target.checked) {

            newCurrentPermissions.push(permission)
        } else {
            newCurrentPermissions = newCurrentPermissions.filter(p => p.id !== permission.id)
        }

        setCurrenetPermissions(newCurrentPermissions);
    }

    const allPermissions = permissions.map((permission) => (
        <Col span={breakPointTablet ? 12 : 24} style={{ padding: '1rem' }} key={permission.id}>
            <Checkbox
                checked={permissions.length !== 0 && (currentPermissions.filter(p => p.id === permission.id).length !== 0)}
                onChange={(e) => handleChangeCheckbox(e, permission)}
            >
                {permission.name}
            </Checkbox>
        </Col>
    ))

    const allRoles = roles.map(role => (
        <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
    ))

    const handleSave = async () => {

        // Update User Role
        const dataResponse_1 = await axios.patch(`${process.env.REACT_APP_API_URL}/role`, {
            userId: user.id,
            roleId: currentRole
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        // Update User Permissions
        const dataResponse_2 = await axios.patch(`${process.env.REACT_APP_API_URL}/permission`, {
            userId: user.id,
            permissions: currentPermissions.map(permission => permission.id)
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (dataResponse_1.data.update === 1 && dataResponse_2.data.message === 'Update Permissions success.') {
            setMessageUpdate({
                status: true,
                message: 'Update user successfully.'
            })
        } else setMessageUpdate({
            status: false,
            message: 'Have some error, please try again later.'
        })
    }


    
    return (!isLoading &&
        <>
            <Row
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderBottom: '1px solid #ccc',
                    borderTop: '1px solid #ccc'
                }}
            >
                {allPermissions}
                <Row
                    style={{
                        width: '100%'
                    }}
                >
                    <Col span={breakPointTablet ? 12 : 24} style={{ padding: breakPointTablet ? '1rem' : '0.5rem' }}>
                        <Select
                            style={{
                                width: '100%',
                            }}
                            placeholder="Vai trò"
                            value={currentRole}
                            onSelect={id => setCurrentRole(id)}
                        >
                            {allRoles}
                        </Select>
                    </Col>
                    <Col
                        span={breakPointTablet ? 12 : 24}
                        style={{
                            padding: breakPointTablet ? '1rem' : '0.5rem'
                        }}
                    >
                        <Button
                            style={{
                                width: '100%',
                                color: themeToken.textColor,
                                backgroundColor: themeToken.mainColor
                            }}
                            onClick={() => setIsShowModal(true)}
                        >
                            Thông tin người dùng
                        </Button>
                    </Col>
                </Row>
                {messageUpdate && <Col span={24}>
                    <Typography.Paragraph
                        style={{
                            textAlign: 'center',
                            margin: '0',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: messageUpdate.status ? 'green' : 'red'
                        }}
                    >
                        {messageUpdate.message}
                    </Typography.Paragraph>
                </Col>}
            </Row>
            <Row
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <Button
                    size="large"
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        width: !breakPointTablet && '100%'
                    }}
                    onClick={handleSave}
                >
                    Lưu thay đổi
                </Button>
            </Row>

            {/* Modal detail user infomation */}
            <Modal
                open={isShowModal}
                onOk={() => setIsShowModal(false)}
                onCancel={() => setIsShowModal(false)}
                style={{
                    top: '3rem'
                }}
            >
                <Row justify='center'>
                    <Avatar
                        src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                        style={{
                            border: 0,
                            width: '7rem',
                            height: '7rem',
                            margin: '1rem 0'
                        }}
                    />
                </Row>
                
                <Row justify='center'>
                    <Typography.Text style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                        {user.verified ?
                            <>
                                <MdOutlineVerified style={{ marginRight: '0.5rem', color: 'green' }} />
                                Tài khoản đã được xác thực
                            </>
                            :
                            <>
                                <AiFillWarning style={{ marginRight: '0.5rem', color: 'red' }} />
                                Tài khoản chưa được xác thực
                            </>
                        }
                    </Typography.Text>
                </Row>

                <FieldInput
                    type='Id'
                    value={`#${user.id}`}
                    disabled
                />
                <FieldInput
                    type='Họ'
                    value={user.lastName}
                    disabled
                />
                <FieldInput
                    type='Tên'
                    value={user.firstName}
                    disabled
                />
                <FieldInput
                    type='Ngày sinh'
                    value={user.dob}
                    disabled
                />
                <FieldInput
                    type='Email'
                    value={user.email}
                    disabled
                />
                <FieldInput
                    type='Địa chỉ'
                    value={user.address}
                    disabled
                />
                <FieldInput
                    type='Tài khoản'
                    value={user.externalType}
                    disabled
                />
                <FieldInput
                    type='Ngày tạo'
                    value={new Date(user.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                    })}
                    disabled
                />
            </Modal>
        </>
    )
}

export default InfoPermission