import { Button, Col, Row, Table, Tag, Typography, theme } from "antd";

import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { shortText, tagsText, tagscolor } from "../../../ManagePostPage";
import { Link } from "react-router-dom";

const HistoryApply = ({ user, layout }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [applies, setApplies] = useState([]);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv-apply/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200 && response.data.status) {
                    setApplies(response.data.applies);
                }
            } catch (err) {
                setApplies([]);
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [])

    const columns = [
        {
            title: 'Bài đăng',
            dataIndex: 'post',
            key: 'post',
            render: (post) => (
                <Link to={`/post/${post.id}`}>{shortText(post.title, 15)}</Link>
            )
        },
        {
            title: 'Công ty',
            dataIndex: 'company',
            key: 'company',
            render: (company) => (
                <Link to={`/company/${company.id}`}>{shortText(company.name, 15)}</Link>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={tagscolor[status]}
                >
                    {tagsText[status]}
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            fixed: 'right',
            render: () => (
                <Button
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                >
                    Xem thêm
                </Button>
            )
        }
    ]

    const data = applies.map(apply => ({
        key: apply.id,
        post: apply.Post,
        company: apply.Post.Conpany,
        createdAt: apply.createdAt.slice(0, 10),
        status: apply.status,
        detail: apply
    }))

    return (
        <Col
            className={styles.container}
            span={layout}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Typography.Title className={styles.title}>
                    Lịch sử ứng tuyển
                </Typography.Title>

                <Table
                    className={styles.table_history}
                    columns={columns}
                    scroll={{
                        x: 600
                    }}
                    loading={isLoading}
                    dataSource={data}
                />
            </Row>

        </Col>
    )
}

export default HistoryApply;