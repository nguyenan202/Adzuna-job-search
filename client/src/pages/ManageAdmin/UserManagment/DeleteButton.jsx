import { Button, Popconfirm } from "antd";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";



const DeleteButton = ({ userId, users, setUsers }) => {

    const [open, setOpen] = useState(false);

    const openNotification = useSelector(state => state.notification);

    const handleDelete = async () => {

        setUsers([...users].filter(user => user.id !== userId));
        openNotification('success', 'Xóa người dùng thành công')
    }

    return (
        <Popconfirm
            title={`Xác nhận xóa người dùng ${userId}`}
            open={open}
            onConfirm={handleDelete}
            onCancel={() => setOpen(false)}
        >
            <Button
                style={{ marginRight: '0.15rem', border: 'red 1px solid' }}
                onClick={() => setOpen(true)}
            >
                <AiFillDelete style={{ color: 'red' }} />
            </Button>
        </Popconfirm>
    )
}

export default DeleteButton;