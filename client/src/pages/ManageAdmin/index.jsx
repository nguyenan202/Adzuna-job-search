import {
    Col,
    Menu,
    Row,
} from 'antd'
import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { BsFilePost } from 'react-icons/bs';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { SiSimpleanalytics } from 'react-icons/si'

import styles from './styles.module.scss';
import UserManagment from './UserManagment';
import PostManagment from './PostManagment';
import CompanyManagment from './CompanyManagment';
import Analytics from './Analytics';

const getItem = (label, key, icon, children, type) => ({
    key,
    icon,
    children,
    label,
    type,
})

const items = [
    getItem('Quản lý người dùng', '0', <BiUser />),
    getItem('Quản lý bài đăng', '1', <BsFilePost />),
    getItem('Quản lý công ty', '2', <HiOutlineBuildingOffice2 />),
    getItem('Analytics', '3', <SiSimpleanalytics />)
];

const renderPage = [
    <UserManagment/>,
    <PostManagment/>,
    <CompanyManagment/>,
    <Analytics/>
]

const ManageAdmin = ({ user }) => {

    const [page, setPage] = useState('0');
    const canAccess = user.UserPermissions.filter(permission => permission.Permission.path === 'manage');
    
    
    return (Boolean(canAccess.length) ?
        <Row
            className={styles.container}
        >
            <Col
                className={styles.container_left}
            >
                <Menu
                    className={styles.menu}
                    onClick={e => setPage(e.key)}
                    defaultSelectedKeys={[page]}
                    mode="inline"
                    items={items}
                    inlineCollapsed={false}
                />
            </Col>
            <Col
                className={styles.container_right}
            >
                {
                    renderPage[page]
                }
            </Col>
        </Row>
        :
        <Row>Access Denied</Row>
    )
}

export default ManageAdmin