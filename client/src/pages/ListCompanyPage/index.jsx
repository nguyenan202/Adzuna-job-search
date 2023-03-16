import { Input, List, Row, Typography } from "antd"

import styles from './styles.module.scss';
import CompanyItem from "./CompanyItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";

const MyList = styled(List)`
    &&& {
        width: 100%;

        .ant-list-items {
            display: flex;
        }

        @media only screen and (max-width: 768px) {
            .ant-list-items {
                display: block;
            }
        }
    }
`

const ListCompanyPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);

    const token = useSelector(state => state.token);

    // const breakpointTablet = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const fetching_company = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/company/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.data.status && response.status === 200) setCompanies(response.data.companies)
            } catch (err) {
                setCompanies([]);
            }
        }

        setIsLoading(true);
        fetching_company().then(() => {
            setIsLoading(false);
        })
    }, [])

    const handleSearch = async (name) => {
        const searchValue = name === '' ? 'getAll' : name
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/company/name/${searchValue}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status && response.status === 200) {
                setCompanies(response.data.companies);
                setIsLoading(false);
            }
        }catch(err) {
            setCompanies([]);
            setIsLoading(false);
        }


    }
    
    return (
        <Row
            className={styles.container}
        >
            <Row
                className={styles.header}
            >
                <Typography.Title className={styles.title}>
                    Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn
                </Typography.Title>
                <Input.Search
                    className={styles.input_search}
                    size="large"
                    enterButton
                    placeholder="e.g Công ty ABC"
                    onSearch={handleSearch}
                />
            </Row>

            <Row
                className={styles.main}
            >
                <Typography.Title className={styles.main_title}>
                    Danh sách các công ty nổi bật
                </Typography.Title>

                <MyList
                    itemLayout="vertical"
                    size="large"
                    pagination={{ pageSize: 3 }}
                    loading={isLoading}
                    dataSource={companies}
                    renderItem={company => <CompanyItem key={company.id} company={company} />}
                />
            </Row>
        </Row>
    )
}

export default ListCompanyPage