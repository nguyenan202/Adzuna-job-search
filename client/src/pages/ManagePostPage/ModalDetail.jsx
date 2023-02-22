import { Button, Col, Modal, Row, Spin, Table, Tag, Typography, theme } from "antd";
import { shortText, tagsText, tagscolor } from ".";

import styles from './styles.module.scss';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import TextAreaField from "../../components/TextAreaField";
import useMediaQuery from "../../hooks/useMediaQuery";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: '1rem',
        }}
        spin
    />
);

const ModalDetail = ({ isShow, setIsShow, selectedPost }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [applies, setApplies] = useState([]);
    const [selectedApply, setSelectedApply] = useState(null);
    const [showModalApproval, setShowModalApproval] = useState(false);
    const [loadingConfirmAcp, setLoadingConfirmAcp] = useState(false);
    const [loadingConfirmReject, setLoadingConfirmReject] = useState(false);
    const [showModalReason, setShowModalReason] = useState(false);
    const [reasonReject, setReasonReject] = useState('');
    const [keyReRender, setKeyReRender] = useState(0);

    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const openNotification = useSelector(state => state.notification);
    const themeToken = theme.useToken().token;
    const navigate = useNavigate();

    const breakPointTablet = useMediaQuery('(max-width: 692px)');

    useEffect(() => {
        const fetching = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv-apply/post/${selectedPost.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response.data.status) {
                setApplies(response.data.allCvUpload)
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [selectedPost.id, keyReRender])

    const columns = [
        {
            title: 'Ứng viên',
            dataIndex: 'user',
            key: 'user'
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Giới thiệu',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={tagscolor[status]}>
                    {tagsText[status]}
                </Tag>
            ),
            sorter: (a, b) => {
                return a - b;
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            fixed: 'right',
            render: (apply) => (
                <Button
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={() => {
                        setSelectedApply(apply);
                        setShowModalApproval(true);
                    }}
                >
                    Xem thêm
                </Button>
            )
        }
    ]

    const data = applies.map(apply => ({
        key: apply.id,
        user: `${apply.User.lastName} ${apply.User.firstName}`,
        createdAt: apply.createdAt.slice(0, 10),
        description: shortText(apply.description, 30),
        status: apply.status,
        detail: apply
    }))

    const handleAccept = async () => {
        setLoadingConfirmAcp(true);

        const data = {
            id: selectedApply.id,
            status: 1
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/cv-apply/status`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response.data) {
                setKeyReRender(keyReRender+1);
                setShowModalApproval(false);
                openNotification('success', 'Duyệt đơn thành công');
            }
        }catch(err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }

        setLoadingConfirmAcp(false);
    }

    const handleReject = async () => {
        setLoadingConfirmReject(true);

        const data = {
            id: selectedApply.id,
            status: 2,
            comment: reasonReject
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/cv-apply/status`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response.data) {
                setKeyReRender(keyReRender+1);
                setShowModalReason(false);
                setShowModalApproval(false);
                openNotification('success', 'Từ chối đơn thành công');
            }
        }catch(err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }

        setLoadingConfirmReject(false);
    }

    return (
        <>
            <Modal
                open={isShow}
                onCancel={() => setIsShow(false)}
                width={992}
                style={{ top: '2rem' }}
                footer={null}
            >
                <Row>
                    <Typography.Title>
                        {selectedPost.title}
                    </Typography.Title>
                </Row>
                <Row className={styles.full_width} justify='center'>
                    <Tag
                        color={tagscolor[selectedPost.status]}
                        style={{ padding: '0.25rem 1rem', marginBottom: '1rem' }}
                    >
                        {tagsText[selectedPost.status]}
                    </Tag>
                </Row>
                <Row style={{ justifyContent: 'flex-end' }}>
                    <Button
                        size='large'
                        style={{
                            width: '100%',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={() => navigate(`/post/${selectedPost.id}`)}
                    >
                        Xem hồ sơ
                    </Button>
                </Row>

                <Table
                    columns={columns}
                    dataSource={data}
                    loading={isLoading}
                    scroll={{
                        x: 600
                    }}
                />
            </Modal>

            {/* Modal chi tiết và duyệt đơn apply job */}
            {selectedApply && <Modal
                open={showModalApproval}
                onCancel={() => setShowModalApproval(false)}
                footer={null}
            >
                <TextAreaField
                    field='Thư ứng tuyển'
                    fieldSize='1.2rem'
                    readOnly
                    rows={5}
                    value={selectedApply.description}
                />
                <Row
                    style={{
                        width: '100%'
                    }}
                >
                    <a
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0.25rem 0',
                            borderRadius: '6px',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        href={`/cv/${selectedApply.CVId}/view-only/${user.id}`}
                        target="_blank"
                        rel='noreferrer'
                    >
                        Xem CV
                    </a>
                </Row>
                <Row
                    style={{
                        width: '100%'
                    }}
                >
                    <Col span={breakPointTablet ? 24 : 12}>
                        <Button
                            style={{
                                width: '100%',
                                backgroundColor: themeToken.mainColor,
                                color: themeToken.textColor,
                                marginTop: '0.5rem',
                                opacity: (loadingConfirmAcp || loadingConfirmReject) && 0.8
                            }}
                            disabled={loadingConfirmAcp || loadingConfirmReject}
                            onClick={handleAccept}
                        >
                            {loadingConfirmAcp && <Spin indicator={antIcon} style={{ color: '#fff', marginRight: '0.5rem' }}/>}
                            Duyệt đơn
                        </Button>
                    </Col>
                    <Col span={breakPointTablet ? 24 : 12}>
                        <Button
                            style={{
                                width: '100%',
                                backgroundColor: 'red',
                                color: themeToken.textColor,
                                marginTop: '0.5rem',
                                opacity: loadingConfirmAcp && 0.8
                            }}
                            disabled={loadingConfirmAcp}
                            onClick={() => setShowModalReason(true)}
                        >
                            Từ chối
                        </Button>
                    </Col>
                </Row>
            </Modal>}

            {/* Modal reason reject */}
            <Modal
                open={showModalReason}
                onCancel={() => setShowModalReason(false)}
                confirmLoading={loadingConfirmReject}
                onOk={handleReject}
            >
                <TextAreaField
                    field='Lý do từ chối đơn'
                    fieldSize='1.2rem'
                    rows={3}
                    placeholder='Ứng viên không đáp ứng đủ nhu cầu, thiếu kinh nghiệm,...'
                    onChange={e => setReasonReject(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default ModalDetail;