
import { Button, Col, Input, Modal, QRCode, Row, Typography, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import MyFieldInput from '../MyFieldInput';
import useMediaQuery from '../../hooks/useMediaQuery';
import styled from 'styled-components';
import ModalHandleAddress from './ModalHandleAddress';
import { useNavigate } from 'react-router-dom';

const MyInput = styled(Input)`
    &&& {
        .ant-input-group-addon {
            padding: 0;
        }
    }
`

const InfoCompany = ({ company, breakPointMobile }) => {

    const [initInfo, setInitInfo] = useState({
        name: company.name,
        size: company.size,
        description: company.description
    })
    const [showSave, setShowSave] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showDeleteAddress, setShowDeleteAddress] = useState(false);
    const [showUpdateAddress, setShowUpdateAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();
    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const breakPointTablet = useMediaQuery('(max-width: 992px)');

    const handleSave = async () => {
        const data = {
            id: company.id,
            ...initInfo
        }

        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/company/infomation`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        setMessage(response.data);
    }

    
    return (
        <Row
            className={styles.sub_container}
            style={{
                backgroundColor: themeToken.componentBackground,
                marginTop: '1.5rem'
            }}
        >
            <Row className={styles.full_width} style={breakPointMobile ? { justifyContent: 'center' } : {}}>
                <Typography.Title style={{ fontSize: '2rem' }}>
                    Thông tin công ty
                </Typography.Title>
            </Row>

            <MyFieldInput
                field='Đặc quyền'
                value={company.Priority.name}
                disabled
                span={breakPointMobile ? 24 : 11}
            />

            <MyFieldInput
                field='Số lượng bài được post trong 1 tháng'
                value={company.Priority.limitPost}
                disabled
                span={breakPointMobile ? 24 : 11}
            />

            <MyFieldInput
                field='ID'
                value={company.id}
                disabled
                span={breakPointMobile ? 24 : 11}
            />

            <MyFieldInput
                field='Ngày tạo công ty'
                value={new Date(company.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
                span={breakPointMobile ? 24 : 11}
                disabled
            />

            <MyFieldInput
                field='Tên công ty'
                value={initInfo.name}
                onChange={(e) => {
                    setInitInfo({
                        ...initInfo,
                        name: e.target.value
                    });
                    setShowSave(true);
                    message && setMessage(null);
                }}
                span={breakPointMobile ? 24 : 11}
            />

            <MyFieldInput
                field='Số thành viên trong công ty'
                placeholder='Nhập số thành viên'
                value={initInfo.size}
                prefix={<UserOutlined />}
                type='number'
                onChange={(e) => {
                    setInitInfo({
                        ...initInfo,
                        size: e.target.value
                    });
                    setShowSave(true);
                    message && setMessage(null);
                }
                }
                span={breakPointMobile ? 24 : 11}
            />

            <Col
                span={breakPointMobile ? 24 : 11}
                style={{
                    margin: '1rem 0'
                }}
            >
                <Button
                    size='large'
                    style={{
                        width: '100%',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={() => setShowAddress(true)}
                >
                    Địa chỉ công ty
                </Button>
            </Col>

            <Col
                span={breakPointMobile ? 24 : 11}
                style={{
                    margin: '1rem 0'
                }}
            >
                <Button
                    size='large'
                    style={{
                        width: '100%',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={() => navigate(`/company/${company.id}`)}
                >
                    Trang cá nhân công ty
                </Button>
            </Col>

            <Col
                span={24}
            >
                <Typography.Paragraph
                    className={styles.title_field}
                >
                    Mô tả công ty
                </Typography.Paragraph>
                <TextArea
                    rows={10}
                    placeholder='Nhập mô tả công ty'
                    value={initInfo.description}
                    onChange={(e) => {
                        setInitInfo({
                            ...initInfo,
                            description: e.target.value
                        });
                        setShowSave(true);
                        message && setMessage(null);
                    }}
                ></TextArea>
            </Col>

            {message && <Row
                className={`${styles.full_width}`}
                justify='center'
            >
                <Typography.Text style={{
                    fontSize: '1rem',
                    color: message.status ? 'green' : 'red',
                    fontWeight: 500
                }}>
                    {message.message}
                </Typography.Text>
            </Row>}

            {showSave && <Row
                className={`${styles.full_width} ${styles.btn_change}`}
            >
                <Button
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        width: breakPointMobile ? '100%' : 'auto'
                    }}
                    size='large'
                    htmlType='submit'
                    onClick={handleSave}
                >
                    Lưu thay đổi
                </Button>
            </Row>}


            {/* Modal show Address company */}
            <Modal
                title={<Typography.Title>Địa chỉ</Typography.Title>}
                open={showAddress}
                onCancel={() => setShowAddress(false)}
                footer={null}
                width={breakPointTablet ? '90vh' : '80vh'}
                style={{ top: '4rem', maxHeight: '90vh' }}
            >
                {company &&
                    company.Addresses.map(address => (
                        <Row
                            key={address.id}
                            style={{
                                margin: '1rem 0'
                            }}
                        >
                            <MyInput
                                value={address.name}
                                readOnly
                                addonAfter={<EditOutlined
                                    style={{
                                        width: '2rem',
                                        height: '1.75rem',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => {
                                        setSelectedAddress(address);
                                        setShowUpdateAddress(true);
                                    }
                                    } />}
                                addonBefore={<DeleteOutlined
                                    style={{
                                        width: '2rem',
                                        height: '1.75rem',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => {
                                        setSelectedAddress(address);
                                        setShowDeleteAddress(true);
                                    }} />}
                            />
                        </Row>
                    ))
                }

                <Row style={{ justifyContent: 'flex-end' }}>
                    <Button
                        size='large'
                        style={{
                            float: 'right',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={() => setShowAddAddress(true)}
                    >
                        <PlusOutlined />Thêm địa chỉ
                    </Button>
                </Row>
            </Modal >

            {/* Modal add new Address */}
            <ModalHandleAddress
                isShow={showAddAddress}
                setIsShow={setShowAddAddress}
                status={1}
                company={company}
            />

            {/* Modal delete Address */}
            {selectedAddress && <ModalHandleAddress
                isShow={showDeleteAddress}
                setIsShow={setShowDeleteAddress}
                status={3}
                value={selectedAddress}
                company={company}
            />}

            {/* Modal update Address */}
            {selectedAddress && <ModalHandleAddress
                isShow={showUpdateAddress}
                setIsShow={setShowUpdateAddress}
                status={2}
                value={selectedAddress}
                company={company}
            />}

        </Row >
    )
}

export default InfoCompany;