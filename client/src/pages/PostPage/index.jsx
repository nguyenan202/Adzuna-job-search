import { Row, Typography } from "antd"
import { useParams } from "react-router-dom"
import HeaderPost from "./HeaderPost";

import styles from './styles.module.scss';
import DetailPost from "./DetailPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SpinLoading from "../../components/SpinLoading";

const PostPage = () => {

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [keyReRender, setKeyReRender] = useState(0);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const fetching = async () => {
            try {

                const response = await axios(`${process.env.REACT_APP_API_URL}/post/id/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.data.status) {
                    setPost(response.data.post);
                }
            } catch (err) {
                err.response.status === 404 && setPost(null);
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [id, keyReRender])

    return (isLoading ? <SpinLoading height='calc(100vh - 66px)' /> :
        (post ?
            <Row
                className={styles.container}
            >
                <Row
                    className={styles.sub_container}
                >
                    <HeaderPost
                        post={post}
                        user={user}
                        keyReRender={keyReRender}
                        setKeyReRender={setKeyReRender}
                    />

                    <DetailPost
                        post={post}
                    />
                </Row>
            </Row >
            :
            <Row style={{ width: '100%', justifyContent: 'center', height: 'calc(100vh - 66px)', alignItems: 'center' }}>
                <Typography.Title>
                    404 Không tìm thấy bài đăng
                </Typography.Title>
            </Row>
        )
    )
}

export default PostPage;