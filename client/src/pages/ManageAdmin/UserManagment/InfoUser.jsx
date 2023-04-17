import { Avatar, Row } from "antd"
import { BsArrowLeft } from "react-icons/bs";

import styles from './styles.module.scss';
import MyFieldInput from '../../../components/MyFieldInput';
import useMediaQuery from "../../../hooks/useMediaQuery";

import MyTag from "../../../components/MyTag";

const InfoUser = ({ user, setSelected }) => {

    const breakPointMobile = useMediaQuery('(max-width: 576px)');
    
    return (
        <Row className={styles.container_info}>
            <BsArrowLeft
                className={styles.back_icon}
                onClick={() => setSelected(null)}
            />
            <Row
                className={styles.avatar}
            >
                <Avatar
                    src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                    alt='avatar'
                    style={{
                        width: '10rem',
                        height: '10rem'
                    }}
                />
            </Row>
            {user.status === 0 && <Row
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '1rem'
                }}
            >
                <MyTag
                    myColor='red'
                    name='Đã khóa'
                    style={{ padding: '0.25rem 1rem' }}
                />
            </Row>}
            <Row
                className={styles.info}
            >
                <MyFieldInput
                    field='ID'
                    value={`#${user.id}`}
                    span={breakPointMobile ? 24 : 11}
                    disabled
                />
                <MyFieldInput
                    field='Vai trò'
                    value={user.Role.name}
                    span={breakPointMobile ? 24 : 11}
                    disabled
                />
                <MyFieldInput
                    field='Ngày tạo tài khoản'
                    value={new Date(user.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                    })}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Ngày tháng năm sinh'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.dob}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Họ'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.lastName}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Tên'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.firstName}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Email'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.email}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Số điện thoại'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.phone}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />
                <MyFieldInput
                    field='Địa chỉ'
                    placeholder='Người dùng chưa cập nhật'
                    value={user.address}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                />               
            </Row>
        </Row>
    )
}

export default InfoUser