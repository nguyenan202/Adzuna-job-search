import { Row, Typography } from "antd";

import styles from './styles.module.scss';
import UpPost from "./UpPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SpinLoading from "../../components/SpinLoading";

const UpPostPage = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [numberPostUp, setNumberPostUp] = useState(null);
    const [company, setCompany] = useState(null);
    const [keyReRender, setKeyReRender] = useState(0);
    
    const token = useSelector(state => state.token);

    useEffect(() => {
        const fetching = async () => {
            try {
                
                const response_company = await axios.get(`${process.env.REACT_APP_API_URL}/company/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const response_limit = await axios.get(`${process.env.REACT_APP_API_URL}/post/current-month/${company ? company.id : response_company.data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setCompany(response_company.data);
                setNumberPostUp(response_company.data.Priority.limitPost - response_limit.data.length);
            } catch (err) {
                err.response.status === 404 && setCompany(null);
            }

        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [keyReRender])


    return (isLoading ? <SpinLoading /> :
        <Row
            className={styles.container}
        >
            {!company &&
                <Row
                    style={{
                        height: 'calc(100vh - 66px - 12rem)'
                    }}
                >
                    <Typography.Title>
                        Bạn chưa có công ty
                    </Typography.Title>
                </Row>
            }

            {(numberPostUp > 0 && company) ? <UpPost
                numberPostUp={numberPostUp}
                company={company}
                keyReRender={keyReRender}
                setKeyReRender={setKeyReRender}
            /> : <></>}

            {(numberPostUp <= 0 && company) && <Row
                style={{
                    height: 'calc(100vh - 66px - 12rem)'
                }}
            >
                <Typography.Title>
                    Bạn đã hết lượt đăng bài trong tháng này
                </Typography.Title>
            </Row>}
        </Row>
    )
}

export default UpPostPage;