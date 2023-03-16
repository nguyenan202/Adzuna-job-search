import { Button, Col, Input, Row, Select, Table, Typography, theme } from "antd"

import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { shortText } from '../../ManagePostPage';
import { Link } from "react-router-dom";
import MyTag from "../../../components/MyTag";
import { AiFillSetting } from "react-icons/ai";
import DeleteButton from "./DeleteButton";
import InfoPost from "./InfoPost";

const PostManagment = () => {

    const [loadingPost, setLoadingPost] = useState(false);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [posts, setPosts] = useState([]);
    const [dataSave, setDataSave] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [search, setSearch] = useState({
        value: '',
        job: 0,
        specialization: 0
    })
    const [keyReRender, setKeyReRender] = useState(0);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    useEffect(() => {
        try {
            const fetching = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/job`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setJobs(response.data);
            }

            const fetchingPosts = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    setPosts([...response.data.posts]);
                    setDataSave([...response.data.posts]);
                }
            }

            setLoadingJobs(true)
            fetching().then(() => {
                setLoadingJobs(false)
            });

            setLoadingPost(true);
            fetchingPosts().then(() => {
                setLoadingPost(false);
            })
        } catch (err) {
            setJobs([]);
        }
    }, [token, keyReRender])

    useEffect(() => {

        try {
            const fetching = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/specialization/${search.job}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setSpecializations(response.data);
            }

            setLoadingSpecs(true)
            fetching().then(() => {
                setLoadingSpecs(false);
            });
        } catch (err) {
            setSpecializations([])
        }

    }, [search.job])

    useEffect(() => {
        if (search.value === '') setPosts(dataSave);

        if (search.specialization !== 0)
            setPosts([...dataSave]
                .filter(post => post.Specialization.id === search.specialization)
                .filter(post => (
                    (post.title.toLowerCase().includes(search.value.toLowerCase())) ||
                    (post.Conpany.name.toLowerCase().includes(search.value.toLowerCase()))
                )));
        else
            setPosts([...dataSave]
                .filter(post => (
                    (post.title.toLowerCase().includes(search.value.toLowerCase())) ||
                    (post.Conpany.name.toLowerCase().includes(search.value.toLowerCase()))
                )));
    }, [search.value, search.specialization])


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render(post) {
                return (
                    <Link
                        to={`../post/${post.id}`}
                        target="_blank"
                    >
                        {shortText(post.title, 30)}
                    </Link>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'endAt',
            key: 'endAt'
        },
        {
            title: 'Công ty',
            dataIndex: 'company',
            key: 'company',
            render(company) {
                return (
                    <Link
                        to={`../company/${company.id}`}
                        target="_blank"
                    >
                        {shortText(company.name, 25)}
                    </Link>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render(post) {

                const outDate = Math.floor((new Date(post.endAt) - new Date()) / (1000 * 60 * 60 * 24)) + 1 <= 0;

                return (
                    <MyTag
                        myColor={post.status === 1 ? (outDate ? 'red' : 'green') : 'grey'}
                        name={post.status === 1 ? (outDate ? 'Quá hạn' : 'Đang chạy') : 'Chưa được duyệt'}
                    />
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render(post) {

                return (
                    <Row>
                        <DeleteButton
                            post={post}
                            keyReRender={keyReRender}
                            setKeyReRender={setKeyReRender}
                        />
                        <Button
                            style={{ marginLeft: '0.15rem', border: `${themeToken.mainColor} 1px solid` }}
                            onClick={() => setSelectedPost(post)}
                        >
                            <AiFillSetting style={{ color: themeToken.mainColor }} />
                        </Button>
                    </Row>
                )
            }
        }
    ]

    const data = posts.map(post => ({
        key: post.id,
        id: post.id,
        title: post,
        createdAt: post.createdAt.slice(0, 10),
        endAt: post.endAt.slice(0, 10),
        company: post.Conpany,
        status: post,
        actions: post
    }))

    return (
        <Row
            className={styles.container}
        >
            {selectedPost ?
                <InfoPost
                    post={selectedPost}
                    setSelected={setSelectedPost}
                    keyReRender={keyReRender}
                    setKeyReRender={setKeyReRender}
                />
                :
                <Row
                    className={styles.container_sub}
                >
                    <Row className={styles.header}>
                        <Typography.Title style={{ width: '100%', textAlign: 'center', height: 'fit-content' }}>
                            Quản lý bài đăng
                        </Typography.Title>
                    </Row>
                    <Row className={styles.search}>
                        <Col span={12}>
                            <Input
                                size="large"
                                placeholder="Tiêu đề"
                                value={search.value}
                                onChange={e => setSearch({
                                    ...search,
                                    value: e.target.value
                                })}
                            />
                        </Col>
                        <Col span={5}>
                            <Select
                                size="large"
                                style={{
                                    width: '100%'
                                }}
                                defaultValue={search.job}
                                loading={loadingJobs}
                                onSelect={id => setSearch({
                                    ...search,
                                    job: id
                                })}
                            >
                                <Select.Option value={0}>Tất cả</Select.Option>
                                {
                                    jobs.map(job => (
                                        <Select.Option value={job.id} key={job.id}>
                                            {job.name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col span={5}>
                            <Select
                                size="large"
                                style={{
                                    width: '100%'
                                }}
                                defaultValue={search.specialization}
                                loading={loadingSpecs}
                                onSelect={id => setSearch({
                                    ...search,
                                    specialization: id
                                })}
                            >
                                <Select.Option value={0}>Tất cả</Select.Option>
                                {
                                    specializations.map(spec => (
                                        <Select.Option value={spec.id} key={spec.id}>
                                            {spec.name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className={styles.table}>
                        <Table
                            loading={loadingPost}
                            className={styles.table_sub}
                            columns={columns}
                            dataSource={data}
                        />
                    </Row>
                </Row>
            }
        </Row>
    )
}

export default PostManagment