import { Button, Col, Empty, Row, Typography, theme } from 'antd';
import styles from './styles.module.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import FormSignCompany from './FormSignCompany';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import SpinLoading from '../../../../components/SpinLoading';
import SignCompanyHistory from '../../../../components/SignCompanyHistory';
import WaitSignCompany from './WaitSignCompany';
import CompanyForm from './CompanyForm';

const socket = io.connect(process.env.REACT_APP_API_URL)

const empty = <Row
    className={styles.full_width}
    justify='center'
>
    <Empty
        description={'chưa có dữ liệu'}
    />
</Row>

const Company = ({ user, layout }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isShowSignCompany, setIsShowSignCompay] = useState(false);
    const [company, setCompany] = useState(null);
    const [historySign, setHistorySign] = useState(null);
    const [keyRerender, setKeyRerender] = useState(0);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const isWaitToSignCompany = historySign && historySign.find(sign => sign.status === 0);

    useEffect(() => {

        const fetchingCompany = async () => {
            try {
                setIsLoading(true);

                const responseCompany = await axios.get(`${process.env.REACT_APP_API_URL}/company/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setCompany(responseCompany.data);

            } catch (err) {
                if (err.response.data.message === 'Not found.') setCompany(null);
            }
        }

        const fetchingHistory = async () => {
            try {

                const responseHistory = await axios.get(`${process.env.REACT_APP_API_URL}/company/history/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setHistorySign(responseHistory.data.length > 0 ? responseHistory.data : null);
                setIsLoading(false);
            } catch (err) {
                if (err.response.data.message === 'Not found.') setCompany(null);
                setIsLoading(false);
            }
        }

        socket.on(`approved-company-userId-${user.id}`, () => {
            fetchingCompany();
            fetchingHistory();
        })

        fetchingCompany();
        fetchingHistory();

    }, [user.id, token, keyRerender]);

    useEffect(() => {

        company && socket.on(`updated-company-${company.id}`, (data) => {
            console.log('emit updated company');
            data.status && setCompany(data.company);
        })

    }, [company])
    
    return (
        <Col
            className={styles.container}
            span={layout}
        >
            {isLoading ? <SpinLoading /> :
                <>

                    {!company ?

                        /* Nếu chưa có công ty và chưa nộp đơn đăng ký */
                        !isWaitToSignCompany ?
                            (<Row
                                className={styles.sub_container}
                                style={{
                                    backgroundColor: themeToken.componentBackground
                                }}
                            >

                                {isShowSignCompany &&
                                    <FormSignCompany
                                        keyRerender={keyRerender}
                                        setKeyRerender={setKeyRerender}
                                    />
                                }

                                {!isShowSignCompany && <Row
                                    className={styles.full_width}
                                >
                                    <Typography.Title style={{ fontSize: '2rem' }}>
                                        Bạn chưa có công ty tại đây
                                    </Typography.Title>
                                </Row>}

                                <Col
                                    className={`${styles.btn_submit_container}`}
                                    span={breakPointMobile || !isShowSignCompany ? 24 : 11}
                                >
                                    <Button
                                        className={styles.btn_submit}
                                        size='large'
                                        style={{
                                            backgroundColor: themeToken.mainColor,
                                            color: themeToken.textColor
                                        }}
                                        onClick={() => setIsShowSignCompay(!isShowSignCompany)}
                                    >
                                        {!isShowSignCompany ? 'Tôi muốn đăng ký công ty' : 'Ẩn đăng ký'}
                                    </Button>
                                </Col>

                            </Row>)
                            :
                            <WaitSignCompany />

                        :

                        /* Đã có công ty */
                        <CompanyForm
                            company={company}
                        />
                    }


                    {/* Phần lịch sử đăng kí công ty */}
                    <Row
                        className={styles.sub_container}
                        style={{
                            backgroundColor: themeToken.componentBackground,
                            margin: '1.5rem 0'
                        }}
                    >
                        <Row
                            className={styles.full_width}
                        >
                            <Typography.Title style={{ fontSize: '2rem' }}>
                                Lịch sử đăng kí
                            </Typography.Title>
                        </Row>

                        {historySign ?
                            <SignCompanyHistory
                                data={historySign}
                            /> :
                            empty
                        }
                    </Row>
                </>}
        </Col >
    )
}

export default Company;