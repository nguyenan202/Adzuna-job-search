import { Modal, Row, Typography } from "antd"
import axios from "axios";
import { useState } from "react"
import { AiFillWarning } from 'react-icons/ai'
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/store";


const ModalRemoveAvatar = ({ isOpenModalRemoveAvatar, setIsOpenModalRemoveAvatar}) => {

    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpenModalRemoveAvatar(false);
    }

    const handleRemove = async () => {
        setIsLoading(true);

        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/image`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId: user.id
            }
        })

        dispatch(setUser({ user: response.data.user }));

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