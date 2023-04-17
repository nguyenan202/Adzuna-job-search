import { Button, Popconfirm } from "antd";
import { useState } from "react";
import { AiFillUnlock } from "react-icons/ai";
import { FaBan } from 'react-icons/fa';
import { useSelector } from "react-redux";
import axios from 'axios';


const DeleteButton = ({ user, keyReRender, setKeyReRender }) => {

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(user.status);

    const openNotification = useSelector(state => state.notification);
    const token = useSelector(state => state.token);

    const handleBan = async () => {

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/user/status`, {
                id: user.id,
                status: status === 1 ? 0 : 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setStatus(response.data.status);
                setOpen(false);
                openNotification('success', status === 1 ? 'Khóa người dùng thành công' : 'Mở khóa người dùng thành công')
                setKeyReRender(keyReRender + 1);
            }
        } catch(err) {
            console.log(err);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    return (
        <Popconfirm
            title={status === 1 ? `Xác nhận khóa người dùng ${user.id}` : `Xác nhận mở khóa người dùng ${user.id}`}
            open={open}
            onConfirm={handleBan}
            onCancel={() => setOpen(false)}
        >
            <Button
                style={{ marginRight: '0.15rem', border: 'red 1px solid' }}
                onClick={() => setOpen(true)}
            >
                {
                    status === 1 ?
                    <FaBan style={{ color: 'red' }} /> :
                    <AiFillUnlock style={{ color: 'red' }} />
                }
            </Button>
        </Popconfirm>
    )
}

export default DeleteButton;