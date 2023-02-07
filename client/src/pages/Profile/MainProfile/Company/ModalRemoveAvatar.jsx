import { Modal, Row, Typography } from "antd"
import axios from "axios";
import { useState } from "react"
import { AiFillWarning } from 'react-icons/ai'
import { useSelector } from "react-redux";


const ModalRemoveAvatar = ({ isOpenModalRemoveAvatar, setIsOpenModalRemoveAvatar, company }) => {

    const [isLoading, setIsLoading] = useState(false);

    const token = useSelector(state => state.token);

    const handleClose = () => {
        setIsOpenModalRemoveAvatar(false);
    }

    const handleRemove = async () => {
        setIsLoading(true);

        await axios.delete(`${process.env.REACT_APP_API_URL}/company/image`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                id: company.id
            }
        })

        setIsLoading(false);
        setIsOpenModalRemoveAvatar(false);
    }

    return (
        <Modal
            open={isOpenModalRemoveAvatar}
            onCancel={handleClose}
            onOk={handleRemove}
            confirmLoading={isLoading}
        >
            
            <Row
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '1rem 0'
                }}
            >
                <Typography.Paragraph
                    style={{
                        fontSize: '1.5rem',
                        margin: 0
                    }}
                >
                    <AiFillWarning style={{ color: 'red' }}/> Xác nhận xóa ảnh đại diện
                </Typography.Paragraph>
            </Row>
        </Modal>
    )
}

export default ModalRemoveAvatar