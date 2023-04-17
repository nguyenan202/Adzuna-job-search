import { Button, Popconfirm } from "antd"
import axios from "axios";
import { useState } from "react"
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";



const DeleteButton = ({ company, keyReRender, setKeyReRender }) => {

    const [isloading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const token = useSelector(state => state.token);
    const openNotification = useSelector(state => state.notification);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/company`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    id: company.id
                }
            })

            if (response.status === 200) {
                setKeyReRender(keyReRender+1);
                openNotification('success', 'Xóa công ty thành công');
            }
        }catch(err) {
            console.log(err);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    return(
        <Popconfirm
            title={`Xác nhận xóa post ${company.id}`}
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