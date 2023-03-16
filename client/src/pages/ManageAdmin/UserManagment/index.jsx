import { Button, Col, Input, Row, Table, Typography, theme } from "antd"
import { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { AiFillSetting } from 'react-icons/ai';

import styles from './styles.module.scss';
import MyTag from "../../../components/MyTag";
import InfoUser from "./InfoUser";
import DeleteButton from "./DeleteButton";

const UserManagment = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [dataSave, setDataSave] = useState([]);
    const [search, setSearch] = useState('');
    const [userSelected, setUserSelected] = useState(null);

    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const themeToken = theme.useToken().token;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    setUsers(response.data.filter(u => u.id !== user.id));
                    setDataSave(response.data.filter(u => u.id !== user.id));
                }
            } catch (err) {
                console.log(err);
            }
        }

        setIsLoading(true);
        fetchUser().then(() => {
            setIsLoading(false);
        })
    }, [token, user.id])

    useEffect(() => {
        if (search === '') setUsers([...dataSave]);
        else {
            const newUsers = dataSave.filter(user => (
                (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase())) ||
                (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
            ))

            setUsers(newUsers);
        }
    }, [search])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (<MyTag color={role.id} name={role.name} />)
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (user) => {

                return (
                    <Row>
                        <DeleteButton
                            userId={user.id}
                            users={users}
                            setUsers={setUsers}
                        />
                        <Button
                            style={{ marginLeft: '0.15rem', border: `${themeToken.mainColor} 1px solid` }}
                            onClick={() => setUserSelected(user)}
                        >
                            <AiFillSetting style={{ color: themeToken.mainColor }} />
                        </Button>
                    </Row>
                )
            }
        }
    ]

    const data = users.map(user => ({
        key: user.id,
        id: user.id,
        name: `${user.lastName} ${user.firstName}`,
        email: user.email,
        createdAt: user.createdAt.slice(0, 10),
        role: user.Role,
        actions: user
    }))



    return (
        <Row
            className={styles.container}
        >
            {userSelected
                ?
                <InfoUser
                    setSelected={setUserSelected}
                    user={userSelected}
                />
                :
                <Row className={`${styles.container_sub}`}>
                    <Row className={styles.header}>
                        <Typography.Title style={{ width: '100%', textAlign: 'center', height: 'fit-content' }}>
                            Quản lý người dùng
                        </Typography.Title>
                    </Row>
                    <Row className={styles.search}>
                        <Col span={17}>
                            <Input
                                size="large"
                                placeholder="Tên, email người dùng muốn tìm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className={styles.table}>
                        <Table
                            className={styles.table_sub}
                            columns={columns}
                            dataSource={data}
                            loading={isLoading}
                        />
                    </Row>
                </Row>
            }
        </Row>
    )
}

export default UserManagment