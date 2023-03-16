import { Button, Col, Input, Row, Table, Typography, theme } from "antd"
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { AiFillSetting } from 'react-icons/ai';

import styles from './styles.module.scss';
import InfoUser from '../UserManagment/InfoUser';
import TagPriority from "./TagPriority";
import DeleteButton from "./DeleteButton";
import InfoCompany from "./InfoCompany";


const CompanyManagment = () => {

    const [dataSave, setDataSave] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [keyReRender, setKeyReRender] = useState(0);
    const [search, setSearch] = useState('');

    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/company/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(value => {
                setCompanies([...value.data.companies]);
                setDataSave([...value.data.companies])
            });
    }, [token])

    useEffect(() => {
        if (search === '') return setCompanies([...dataSave]);

        const newData = dataSave.filter(company => company.name.toLowerCase().includes(search.toLowerCase()));
        setCompanies(newData);
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
            key: 'name',
            render(company) {
                return (
                    <Link
                        to={`../company/${company.id}`}
                        target="_blank"
                    >
                        {company.name}
                    </Link>
                )
            }
        },
        {
            title: 'Chủ sở hữu',
            dataIndex: 'user',
            key: 'user',
            render(user) {
                return (
                    <Link
                        to='#'
                        onClick={e => {
                            e.preventDefault();
                            setUserSelected(user);
                        }}
                    >
                        {`${user.lastName} ${user.firstName}`}
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
            title: 'Cấp',
            dataIndex: 'priority',
            key: 'priority',
            render(priority) {
                return(
                    <TagPriority
                        id={priority.id}
                        name={priority.name}
                    />
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render(company) {
                return (
                    <Row>
                        <DeleteButton
                            company={company}
                            keyReRender={keyReRender}
                            setKeyReRender={setKeyReRender}
                        />
                        <Button
                            style={{ marginLeft: '0.15rem', border: `${themeToken.mainColor} 1px solid` }}
                            onClick={() => setSelectedCompany(company)}
                        >
                            <AiFillSetting style={{ color: themeToken.mainColor }} />
                        </Button>
                    </Row>
                )
            }
        }
    ]
    
    const data = companies.map(company => ({
        key: company.id,
        id: company.id,
        name: company,
        user: company.User,
        createdAt: company.createdAt.slice(0, 10),
        priority: company.Priority,
        actions: company
    }))

    return (
        <Row
            className={styles.container}
        >
            {(!userSelected && !selectedCompany) &&
                <Row
                    className={styles.container_sub}
                >
                    <Row className={styles.header}>
                        <Typography.Title style={{ width: '100%', textAlign: 'center', height: 'fit-content' }}>
                            Quản lý công ty
                        </Typography.Title>
                    </Row>
                    <Row className={styles.search}>
                        <Col span={17}>
                            <Input
                                size="large"
                                placeholder="Tên công ty cần tìm"
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
                        />
                    </Row>
                </Row>
            }
            {userSelected &&
                <InfoUser
                    user={userSelected}
                    setSelected={setUserSelected}
                />
            }
            {selectedCompany &&
                <InfoCompany
                    company={selectedCompany}
                    setSelected={setSelectedCompany}
                />
            }
        </Row>
    )
}

export default CompanyManagment