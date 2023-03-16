import { Button, Popconfirm } from "antd"
import { useState } from "react"
import { AiFillDelete } from "react-icons/ai";



const DeleteButton = ({ company, keyReRender, setKeyReRender }) => {

    const [isloading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    return(
        <Popconfirm
            title={`Xác nhận xóa post ${company.id}`}
            open={open}
            // onConfirm={handleDelete}
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