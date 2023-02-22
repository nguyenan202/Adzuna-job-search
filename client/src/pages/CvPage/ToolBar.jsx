import { Button, Input, Row, Spin, theme } from "antd"
import { IoIosSave } from 'react-icons/io'

import styles from './styles.module.scss';
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ExportPDF from "./ExportPDF";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 20,
        }}
        spin
    />
);

const ToolBar = ({ state, dispatch }) => {

    const [isLoading, setIsLoading] = useState(false);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const openNotification = useSelector(state => state.notification);

    const navigate = useNavigate();

    const handleSave = async () => {

        try {
            setIsLoading(true);
            const data = new FormData();
            state.pictureChange && data.append('picture', state.pictureChange);
            data.append('id', state.id);
            const response_picture = state.pictureChange && await axios.patch(`${process.env.REACT_APP_API_URL}/cv/picture`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/cv`, state, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if ((!response_picture || response_picture.status === 200) && response.status === 200 && response.data.status) {
                console.log(response_picture);
                setIsLoading(false);
                openNotification('success', 'Thành công');
            }
        } catch (err) {
            setIsLoading(false);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    return (
        <Row
            className={styles.toolBar}
            style={{ backgroundColor: themeToken.componentBackground }}
        >
            <Row>
                <Input
                    className={styles.toolBar_cvName}
                    size='large'
                    spellCheck={false}
                    value={state.name}
                    onChange={(e) => dispatch({
                        type: 'set_name',
                        payload: e.target.value
                    })}
                />
            </Row>
            <Row>
                <Button
                    className={styles.toolBar_saveBtn}
                    size='large'
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        opacity: isLoading && 0.8
                    }}
                    disabled={isLoading}
                    onClick={handleSave}
                >
                    {isLoading ?
                        <Spin indicator={antIcon} style={{ marginRight: '0.5rem', color: '#fff' }} /> :
                        <IoIosSave style={{ marginRight: '0.5rem' }} />
                    }
                    Lưu lại
                </Button>
                <Button
                    className={styles.toolBar_saveBtn}
                    size="large"
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        margin: '0 1rem'
                    }}
                    onClick={() => navigate(`/cv/${state.id}/view-only/${user.id}`)}
                >
                    <AiFillEye style={{ marginRight: '0.5rem' }}/>
                    Xem
                </Button>
                <ExportPDF
                    downloadFileName={state.name}
                    rootElementId='resume-download-page'
                />
            </Row>
        </Row>
    )
}

export default ToolBar