import { Button, Popconfirm } from "antd"
import axios from "axios";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";


const DeleteButton = ({ post, keyReRender, setKeyReRender }) => {

    const [isloading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const notification = useSelector(state => state.notification);
    const token = useSelector(state => state.token);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/post`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    id: post.id
                }
            })

            if (response.status === 200) {
                setIsLoading(false);
                setOpen(false);
                notification('success', 'Xóa bài đăng thành công');
                setKeyReRender(keyReRender+1);
            }
        } catch (err) {
            setIsLoading(false);
            setOpen(false);
            notification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    return (
        <Popconfirm
            title={`Xác nhận xóa post ${post.id}`}
            open={open}
            onConfirm={handleDelete}
            onCancel={() => setOpen(false)}
            okButtonProps={{
                loading: isloading
            }}
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

export default DeleteButton