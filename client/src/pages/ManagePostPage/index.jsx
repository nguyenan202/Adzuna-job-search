import { Button, Row, Table, Tag, Typography, theme } from "antd";

import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SpinLoading from "../../components/SpinLoading";
import styled from "styled-components";
import { socket } from '../../App';
import ModalDetail from "./ModalDetail";

export const shortText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const MyTable = styled(Table)`
    &&& {
        .ant-table-cell {
            z-index: 0;
        }
    }
`

export const tagscolor = ['default', 'success', 'error']
export const tagsText = ['Đang chờ', 'Đã duyệt', 'Bị từ chối']

const ManagePostPage = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [company, setCompany] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    
    useEffect(() => {
        const fetching = async () => {
            try {
                const response_company = await axios.get(`${process.env.REACT_APP_API_URL}/company/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                response_company.data && setCompany(response_company.data)

                const response_posts = response_company.data.id && await axios.get(`${process.env.REACT_APP_API_URL}/post/company/${response_company.data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response_posts.data.status) setPosts(response_posts.data.posts);
            } catch (err) {
                err.response.status === 404 && setCompany(null)
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [user.id, token])

    useEffect(() => {

        company && socket.on(`update-posts-companyId-${company.id}`, async () => {
            const response_posts = await axios.get(`${process.env.REACT_APP_API_URL}/post/company/${company.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response_posts.data.status) setPosts(response_posts.data.posts);
        });

        if (company) return () => {
            socket.off(`update-posts-companyId-${company.id}`)
        }
    }, [company])

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title'
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
            title: 'Trạng thái duyệt',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={tagscolor[status]}>{tagsText[status]}</Tag>
        },
        {
            title: 'Trạng thái đơn',
            dataIndex: 'statusPost',
            key: 'statusPost',
            render: (post) => {
                const isOutDate = Math.floor((new Date(post.endAt) - new Date()) / (1000 * 60 * 60 * 24)) + 1 <= 0;
                
                return <Tag color={post.status !== 1 ? 'red' : !isOutDate ? 'green' : 'red'}>{isOutDate ? 'Hết hạn' : post.status !== 1 ? 'Không khả dụng' : 'Đang chạy'}</Tag>
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
                        setSelectedPost(post)
                        setShowModal(true)
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
        startAt: post.startAt,
        endAt: post.endAt,
        status: post.status,
        statusPost: post,
        detail: post
    }))

    const addresses = selectedPost && selectedPost.PostAddresses.reduce((cur, next) => {
        return `${cur}• ${next.Address.name}\n`
    }, '')


    return (isLoading ? <SpinLoading /> :
        <Row
            className={styles.container}
        >
            {company ? <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Typography.Title
                    style={{ width: '100%', textAlign: 'center', height: '4rem' }}
                >
                    Quản lý các bài đăng
                </Typography.Title>

                <Row
                    className={styles.full_width}
                    style={{
                        marginTop: '1rem'
                    }}
                >
                    <MyTable
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
                :
                <Row
                    style={{
                        height: 'calc(100vh - 66px - 12rem)'
                    }}
                >
                    <Typography.Title>
                        Bạn chưa có công ty
                    </Typography.Title>
                </Row>
            }


            {/* Modal show detail post */}
            {selectedPost && 
                <ModalDetail
                    isShow={showModal}
                    setIsShow={setShowModal}
                    selectedPost={selectedPost}
                />
            }
        </Row>
    )
}

export default ManagePostPage;