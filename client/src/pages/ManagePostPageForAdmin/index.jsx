import { Button, Row, Table, Typography, notification, theme } from "antd"

import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { shortText } from "../ManagePostPage";
import { Link, useNavigate } from "react-router-dom";
import ModalDetailPost from "./ModalDetailPost";
import SpinLoading from "../../components/SpinLoading";

const ManagePostPageForAdmin = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postSelected, setPostSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [keyReRender, setKeyReRender] = useState(0);
    const [api, contextHolder] = notification.useNotification();

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 1
        });
    }

    useEffect(() => {
        const fetching = async () => {

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/post`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                response.data.status && setPosts(response.data.posts);
            } catch (err) {
                console.log(err);
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })

    }, [token, keyReRender])

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Công ty',
            dataIndex: 'company',
            key: 'company',
            render: (company) => {
                return (
                    <Link
                        to={`/company/${company.id}`}
                    >
                        {company.name}
                    </Link>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'startAt',
            key: 'startAt',
            sorter: (a, b) => {
                a = a.startAt.split('-').reverse().join('');
                b = b.startAt.split('-').reverse().join('');
                return a > b ? 1 : a < b ? -1 : 0;
            }
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endAt',
            key: 'endAt',
            sorter: (a, b) => {
                a = a.endAt.split('-').reverse().join('');
                b = b.endAt.split('-').reverse().join('');
                return a > b ? 1 : a < b ? -1 : 0;
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            fixed: 'right',
            render: (post) => (
                <Button
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={() => {
                        setPostSelected(post);
                        setShowModal(true);
                    }}
                >
                    Xem thêm
                </Button>
            )
        }
    ]

    const data = posts.map(post => ({
        key: post.id,
        title: shortText(post.title, 25),
        company: post.Conpany,
        startAt: post.startAt,
        endAt: post.endAt,
        detail: post
    }))

    return (isLoading ? <SpinLoading height='calc(100vh - 66px)'/> :
        <Row
            className={styles.container}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Typography.Title
                    style={{ width: '100%', textAlign: 'center', height: '4rem' }}
                >
                    Phê duyệt bài đăng
                </Typography.Title>

                <Row
                    className={styles.full_width}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: 600
                        }}
                        style={{
                            width: '100%'
                        }}
                    />
                </Row>
            </Row>

            {/* Notification */}
            {contextHolder}

            {/* Modal Detail Post */}
            {postSelected &&
                <ModalDetailPost
                    isShow={showModal}
                    setIsShow={setShowModal}
                    post={postSelected}
                    width={692}
                    openNotificationWithIcon={openNotificationWithIcon}
                    keyReRender={keyReRender}
                    setKeyReRender={setKeyReRender}
                    style={{
                        top: '2rem',
                        marginBottom: '10rem'
                    }}
                />
            }
        </Row>
    )
}

export default ManagePostPageForAdmin;