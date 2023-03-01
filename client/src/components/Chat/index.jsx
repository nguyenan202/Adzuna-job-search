import { Avatar, Row, theme } from "antd"
import { AiFillWechat } from "react-icons/ai"

import styles from './styles.module.scss';
import ChatComponent from "../ChatComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { addBoxChat } from "../../redux/store";
import { socket } from "../../App";

const Chat = () => {

    const [showChats, setShowChats] = useState(false);
    const [chats, setChats] = useState([]);
    const [usersOnline, setUsersOnline] = useState([]);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const boxChat = useSelector(state => state.chats);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetching = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/room-chat/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setChats(response.data);
        }

        const setData = (data) => setUsersOnline(data)

        fetching();

        socket.on('update-online', setData);

        socket.emit(`first-mounted-${user.id}`)

        return () => socket.off('update-online', setData);
    }, [token, user.id])

    const listChat = chats.map(chat => {
        const image = chat.User.Conpany ? chat.User.Conpany.picturePath : chat.User.picturePath
        const online = usersOnline.find(id => id === chat.User.id);

        return (
            <Row key={chat.id} justify='center' style={{ width: '100%', margin: '0.5rem 0' }}>
                <Avatar
                    className={styles.list_avatar}
                    src={`${process.env.REACT_APP_API_URL}/images/${image}`}
                    size='large'
                    style={{ objectFit: 'contain', border: `3px solid ${online ? '#61ed37' : '#ccc'}` }}
                    onClick={() => dispatch(addBoxChat({ chat: chat.id }))}
                />
            </Row>
        )
    })
    
    return (
        <Row className={styles.container}>
            <Row
                className={styles.btn}
            >
                {showChats && <Row className={styles.list}>
                    {listChat}
                </Row>}
                <AiFillWechat
                    className={styles.icon}
                    style={{
                        color: themeToken.mainColor
                    }}
                    onClick={() => setShowChats(!showChats)}
                />
            </Row>

            <Row
                className={styles.container_chat}
            >
                {
                    boxChat.map(box => <ChatComponent key={box} id={box} usersOnline={usersOnline} />)
                }
            </Row>
        </Row>
    )
}

export default Chat