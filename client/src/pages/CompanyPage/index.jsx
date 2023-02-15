import { Row } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import SpinLoading from "../../components/SpinLoading";
import styles from './styles.module.scss';
import HeaderCompanyProfile from "./HeaderCompanyProfile";
import DetailCompany from "./DetailCompany";

const CompanyPage = ({ user }) => {

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [company, setCompany] = useState(null);
    const [keyReRender, setKeyReRender] = useState(false);
    
    const token = useSelector(state => state.token);
    
    useEffect(() => {
        const fetching_company = async () => {
            try{
                const response = await axios(`${process.env.REACT_APP_API_URL}/company/id/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
    
                if (response.data.status) {
                    setCompany(response.data.company);
                }
            }catch(err) {
                setCompany(null);
            }
        }

        setIsLoading(true);
        fetching_company().then(() => {
            setIsLoading(false);
        })
    }, [id, token, keyReRender])

    return (isLoading ? <SpinLoading height='calc(100vh - 66px)' /> :
        (company ?
            <Row
                className={styles.container}
            >
                <Row
                    className={styles.sub_container}
                >
                    <HeaderCompanyProfile
                        company={company}
                        keyReRender={keyReRender}
                        setKeyReRender={setKeyReRender}
                    />

                    <DetailCompany
                        company={company}
                    />
                </Row>
            </Row> :
            <Row>
                Không tìm thấy công ty
            </Row>
        )
    )
}

export default CompanyPage;