import { Avatar, Modal, Row, Typography } from "antd"
import { MdOutlineVerified } from "react-icons/md";
import { AiFillWarning } from "react-icons/ai";
import FieldInput from '../../components/FieldInput'


const ModalInfoUser = ({ user, isShowModal, setIsShowModal }) => {


    return (
        <Modal
            open={isShowModal}
            onOk={() => setIsShowModal(false)}
            onCancel={() => setIsShowModal(false)}
            style={{
                top: '3rem'
            }}
        >
            <Row justify='center'>
                <Avatar
                    src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                    style={{
                        border: 0,
                        width: '7rem',
                        height: '7rem',
                        margin: '1rem 0'
                    }}
                />
            </Row>

            <Row justify='center'>
                <Typography.Text style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    {user.verified ?
                        <>
                            <MdOutlineVerified style={{ marginRight: '0.5rem', color: 'green' }} />
                            Tài khoản đã được xác thực
                        </>
                        :
                        <>
                            <AiFillWarning style={{ marginRight: '0.5rem', color: 'red' }} />
                            Tài khoản chưa được xác thực
                        </>
                    }
                </Typography.Text>
            </Row>

            <FieldInput
                type='Id'
                value={`#${user.id}`}
                disabled
            />
            <FieldInput
                type='Họ'
                value={user.lastName}
                disabled
            />
            <FieldInput
                type='Tên'
                value={user.firstName}
                disabled
            />
            <FieldInput
                type='Ngày sinh'
                value={user.dob}
                disabled
            />
            <FieldInput
                type='Email'
                value={user.email}
                disabled
            />
            <FieldInput
                type='Địa chỉ'
                value={user.address}
                disabled
            />
            <FieldInput
                type='Tài khoản'
                value={user.externalType}
                disabled
            />
            <FieldInput
                type='Ngày tạo'
                value={new Date(user.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                })}
                disabled
            />
        </Modal>
    )
}

export default ModalInfoUser