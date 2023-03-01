import { Avatar, Input, Row, Typography, theme } from "antd"
import { GrFormClose } from 'react-icons/gr'

import styles from './styles.module.scss';
import SpinLoading from '../SpinLoading';
import { useDispatch, useSelector } from "react-redux";
import { removeBoxChat } from '../../redux/store';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from '../../App';

const ChatComponent = ({ id, usersOnline }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOnline, setIsOnline] = useState(false);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;
    const dispatch = useDispatch();

    const endRef = useRef();

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const handleChat = async () => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/message`, {
            text: input,
            userId: user.id,
            roomChatId: id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status === 200) {
            const newMessages = [...messages];
            newMessages.push(response.data)

            setMessages(newMessages);
            setInput('');
            setTimeout(() => {
                scrollToBottom();
            }, 100)
        }
    }


    useEffect(() => {
        const fetching = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/room-chat/${id}/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response_msg = await axios.get(`${process.env.REACT_APP_API_URL}/message/room-chat/${response.data.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response_msg.status === 200) {
                setChat(response.data);
                setMessages(response_msg.data);
                setTimeout(() => {
                    scrollToBottom();
                }, 100)
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [id, token, user]);

    useEffect(() => {
        const handleData = async () => {
            const response_msg = await axios.get(`${process.env.REACT_APP_API_URL}/message/room-chat/${chat.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response_msg.status === 200) {
                setMessages(response_msg.data)
                setTimeout(() => {
                    scrollToBottom();
                }, 100)
            }
        }


        chat && socket.on(`update-chatRoom-${chat.id}`, handleData);

        socket.emit(`first-mounted-${user.id}`)

        if (chat) return () => {
            socket.off(`update-chatRoom-${chat.id}`, handleData);
        }
    }, [chat, token, user])

    useEffect(() => {

        const isOnline = chat && usersOnline.find(userIdOnline => userIdOnline === chat.User.id);

        isOnline ? setIsOnline(true) : setIsOnline(false);

    }, [usersOnline, chat])


    const listMessage = messages.map(message => (
        <Row key={message.id} className={styles.body_message} style={message.userId === user.id && { justifyContent: 'flex-end' }}>
            <Row className={message.userId === user.id ? styles.body_message_item_my : styles.body_message_item}>
                {message.text}
            </Row>
        </Row>
    ))

    return (
        <Row
            className={styles.container}
            style={{ backgroundColor: themeToken.mainBackground }}
        >
            {isLoading &&
                <Row className={styles.container_loading}>
                    <SpinLoading width='100%' height='100%' />
                </Row>}
            {chat &&
                <>
                    <Row className={styles.header}>
                        <Row>
                            <Avatar
                                style={{ objectFit: 'contain', border: '1px solid #ccc' }}
                                src={chat.User.Conpany ? `${process.env.REACT_APP_API_URL}/images/${chat.User.Conpany.picturePath}` : `${process.env.REACT_APP_API_URL}/images/${chat.User.picturePath}`}
                            />
                            <Row style={{ marginLeft: '0.5rem' }}>
                                <Typography.Paragraph className={styles.header_name}>
                                    {chat.User.Conpany ? chat.User.Conpany.name : `${chat.User.lastName} ${chat.User.firstName}`}
                                </Typography.Paragraph>
                                <Row style={{ width: '100%', alignItems: 'flex-end' }}>
                                    <div
                                        style={{
                                            width: '0.5rem',
                                            height: '0.5rem',
                                            outline: '1px solid #ccc',
                                            margin: '0 0.35rem 0.2rem 0',
                                            borderRadius: '50%',
                                            backgroundColor: isOnline ? '#61ed37' : '#6c6c6c'
                                        }}
                                    ></div> {isOnline ? 'online' : 'offline'}
                                </Row>
                            </Row>
                        </Row>
                        <Row>
                            <GrFormClose className={styles.header_close} onClick={() => dispatch(removeBoxChat({ chat: id }))} />
                        </Row>
                    </Row>
                    <Row className={styles.body}>
                        <Row className={styles.body_messages}>
                            <Row
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignContent: 'flex-start'
                                }}
                            >
                                {listMessage}
                                <div ref={endRef}></div>
                            </Row>
                        </Row>
                        <Row className={styles.body_input}>
                            <Input.Search
                                enterButton='Gửi'
                                placeholder="Aaaa"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onSearch={handleChat}
                            />
                        </Row>
                    </Row>
                </>
            }
        </Row>
    )
}

export default ChatComponent