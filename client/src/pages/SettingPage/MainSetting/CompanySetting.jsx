import { Button, Col, Modal, Row, Spin, Table, Typography, notification, theme } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import ModalInfoUser from "../../../components/ModalInfoUser";
import MyFieldInput from "../../../components/MyFieldInput";
import TextArea from "antd/es/input/TextArea";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { socket } from '../../../App';


const loading = (
    <Row
        style={{
            width: '100%',
            justifyContent: 'center',
            padding: '5rem 0'
        }}
    >
        <Spin />
    </Row>
)

const CompanySetting = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [isShowModalRequest, setIsShowModalRequest] = useState(false);
    const [isShowModalConfirmReject, setIsShowModalConfirmReject] = useState(false);
    const [textReason, setTextReason] = useState('');
    const [requests, setRequests] = useState(null);
    const [user, setUser] = useState(null);
    const [requestChoose, setRequestChoose] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [keyRerender, setKeyRerender] = useState(0);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    useEffect(() => {
        const fetching = async () => {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/company/request/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setRequests(response.data);
            setIsLoading(false);
        }

        fetching();
    }, [token, keyRerender])

    useEffect(() => {

        socket.on('has-request-company', async () => {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/company/request/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setRequests(response.data);
            setIsLoading(false);
        })
    }, [socket])


    const openNotificationWithIcon = (type, message) => {
        type === 'success' && api[type]({
            message: message,
            duration: 2,
        });

        type === 'error' && api[type]({
            message: message,
            duration: 2,
        })
    };

    const columns = [
        {
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Người đăng ký',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <a
                    onClick={() => {
                        setUser(user);
                        setIsShowModalUser(true);
                    }}
                >
                    {`${user.lastName} ${user.firstName}`}
                </a>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => {
                a = a.date.split('/').reverse().join('');
                b = b.date.split('/').reverse().join('');
                return a > b ? 1 : a < b ? -1 : 0;
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            render: (data) => (
                <Button
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={() => {
                        setRequestChoose(data);
                        setIsShowModalRequest(true);
                    }}
                >
                    Xem
                </Button>
            )
        }
    ]

    const data = requests && requests.map(request => {
        const date = new Date(request.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return {
            key: request.id,
            name: request.name,
            user: request.User,
            date: formattedDate,
            detail: request
        }
    })

    const handleCloseModalRequest = () => {
        setIsShowModalRequest(false);
        setRequestChoose(null);
    }

    const handleAccept = async () => {

        const data = {
            companyId: requestChoose.id,
            status: 1,
            userId: requestChoose.User.id
        }

        try {

            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/company`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            openNotificationWithIcon('success', 'Duyệt đơn thành công');

            setTimeout(() => {
                setKeyRerender(keyRerender + 1);
            }, 2000)
        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi vui lòng thử lại sau');
        }

        setIsShowModalRequest(false);
        setRequestChoose(null);

        setTimeout(() => {
            setKeyRerender(keyRerender + 1);
        }, 2000)
    }

    const handleReject = () => {

        const data = {
            companyId: requestChoose.id,
            status: 2,
            userId: requestChoose.User.id,
            comment: textReason
        }
        if (textReason.length !== 0) {

            try {

                const response = axios.patch(`${process.env.REACT_APP_API_URL}/company`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                openNotificationWithIcon('success', 'Từ chối đơn thành công');
            } catch (err) {
                openNotificationWithIcon('error', 'Có lỗi vui lòng thử lại sau');
            }

            setIsShowModalConfirmReject(false);
            setIsShowModalRequest(false);
            setTextReason('');

            setTimeout(() => {
                setKeyRerender(keyRerender + 1);
            }, 2000)
        }
        else {
            openNotificationWithIcon('error', 'Vui lòng nhập lý do')
        }
    }

    return (isLoading ? loading :
        <Row
            className={styles.sub_container}
            style={{
                width: '100%',
                backgroundColor: themeToken.componentBackground
            }}
        >
            <Table
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 500
                }}
                style={{
                    width: '100%'
                }}
            />

            {contextHolder}

            {/* Modal view user */}
            {user &&
                <ModalInfoUser
                    user={user}
                    isShowModal={isShowModalUser}
                    setIsShowModal={setIsShowModalUser}
                />
            }

            {/* Modal detail request */}
            <Modal
                open={isShowModalRequest}
                onCancel={handleCloseModalRequest}
                footer={null}
                style={{ top: '2rem' }}
            >
                {requestChoose &&
                    <>
                        <Row
                            style={{
                                width: '100%'
                            }}
                        >
                            <Typography.Title>
                                {requestChoose.title}
                            </Typography.Title>
                            <MyFieldInput
                                field='Người đăng ký'
                                value={`${requestChoose.User.lastName} ${requestChoose.User.firstName}`}
                                readOnly
                                span={24}
                            />
                            <MyFieldInput
                                field='Tên công ty'
                                value={requestChoose.name}
                                readOnly
                                span={24}
                            />
                            <MyFieldInput
                                field='Website Công ty'
                                value={requestChoose.url}
                                readOnly
                                span={24}
                            />
                            <Typography.Paragraph
                                style={{
                                    marginBottom: '0.25rem',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                    // color: isInvalidMessage && 'red'
                                }}
                            >
                                Nội dung
                            </Typography.Paragraph>
                            <TextArea
                                value={requestChoose.reason}
                                readOnly
                                rows={3}
                                style={{ resize: 'none' }}
                            >
                            </TextArea>
                            <MyFieldInput
                                field='Ngày gửi'
                                value={new Date(requestChoose.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'numeric',
                                    year: 'numeric'
                                })}
                                readOnly
                                span={24}
                            />
                        </Row>
                        <Row
                            style={{ width: '100%' }}
                            justify='space-between'
                        >
                            <Col span={breakPointMobile ? 24 : 11}>
                                <Button
                                    size="large"
                                    style={{
                                        width: '100%',
                                        margin: '0.5rem 0',
                                        backgroundColor: themeToken.mainColor,
                                        color: themeToken.textColor
                                    }}
                                    onClick={handleAccept}    // status = 1 -> accept
                                >
                                    Chấp nhận
                                </Button>
                            </Col>
                            <Col span={breakPointMobile ? 24 : 11}>
                                <Button
                                    size="large"
                                    style={{
                                        width: '100%',
                                        margin: '0.5rem 0',
                                        backgroundColor: 'red',
                                        color: themeToken.textColor
                                    }}
                                    onClick={() => setIsShowModalConfirmReject(true)}    //  status = 2 -> reject
                                >
                                    Từ chối
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
            </Modal>

            <Modal
                title='Ghi chú lý do hủy đơn'
                open={isShowModalConfirmReject}
                onCancel={() => setIsShowModalConfirmReject(false)}
                onOk={handleReject}
            >
                <TextArea
                    placeholder="Lý do...."
                    rows={4}
                    value={textReason}
                    onChange={(e) => setTextReason(e.target.value)}
                    style={{ resize: 'none' }}
                >

                </TextArea>
            </Modal>
        </Row>
    )
}

export default CompanySetting