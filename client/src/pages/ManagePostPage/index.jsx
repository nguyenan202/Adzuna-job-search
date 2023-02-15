import { Button, Modal, Row, Table, Tag, Typography, theme } from "antd";

import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SpinLoading from "../../components/SpinLoading";
import MyFieldInput from "../../components/MyFieldInput";
import { genders } from "../UpPostPage/UpPost";
import TextAreaField from "../../components/TextAreaField";
import { socket } from "../../App";
import styled from "styled-components";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";

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

const tagscolor = ['default', 'success', 'error']
const tagsText = ['Đang chờ', 'Đã duyệt', 'Bị từ chối']

const ManagePostPage = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [company, setCompany] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const breakpointMobile = useMediaQuery('(max-width: 576px)');
    
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
                
                return <Tag color={!isOutDate || post.status !== 1 ? 'green' : 'red'}>{isOutDate ? 'Hết hạn' : post.status !== 1 ? 'Không khả dụng' : 'Đang chạy'}</Tag>
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
            {selectedPost && <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => setShowModal(false)}
                width={692}
                style={{ top: '2rem' }}
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
                <Row className={styles.full_width} justify='space-between'>
                    {selectedPost.status === 2 &&
                        <TextAreaField
                            field='Lý do bị từ chối'
                            value={selectedPost.reason}
                            span={24}
                            rows={4}
                            readOnly
                        />
                    }
                    <MyFieldInput
                        field='Ngày tạo'
                        value={selectedPost.startAt}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Ngày kết thúc'
                        value={selectedPost.endAt}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Mức lương'
                        value={`${selectedPost.salary} VNĐ`}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Số lượng cần tuyển'
                        value={selectedPost.quantity}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Giới tính'
                        value={genders.find(gender => gender.id === selectedPost.gender).name}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Lĩnh vực'
                        value={selectedPost.Specialization.name}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Hình thức làm việc'
                        value={selectedPost.WorkingTime.name}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Cấp độ'
                        value={selectedPost.Level.name}
                        readOnly
                        span={24}
                    />
                    <MyFieldInput
                        field='Kinh nghiệm'
                        value={selectedPost.ExperiencePost.name}
                        readOnly
                        span={24}
                    />
                    <TextAreaField
                        field='Địa điểm làm việc'
                        value={addresses}
                        readOnly
                        rows={selectedPost.PostAddresses.length + 1}
                        span={24}
                    />
                    <TextAreaField
                        field='Mô tả công việc'
                        value={selectedPost.description}
                        readOnly
                        rows={5}
                        span={24}
                    />
                    <TextAreaField
                        field='Yêu cầu ứng viên'
                        value={selectedPost.requirments}
                        readOnly
                        rows={5}
                        span={24}
                    />
                    <TextAreaField
                        field='Quyền lợi'
                        value={selectedPost.benefits}
                        readOnly
                        rows={5}
                        span={24}
                    />
                </Row>
            </Modal>}
        </Row>
    )
}

export default ManagePostPage;