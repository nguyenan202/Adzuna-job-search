import { Col, Image, Row, Typography } from "antd"
import { shortText } from "../ManagePostPage"
import { Link } from "react-router-dom"
import useMediaQuery from "../../hooks/useMediaQuery"


const CompanyItem = ({ company }) => {

    const breakpointTablet = useMediaQuery('(max-width: 768px)');
    
    return (company &&
        <Col
            span={breakpointTablet ? 24 : 8}
            style={{ padding: '1rem' }}
        >
            <Row
                style={{
                    padding: '1rem 2rem',
                    border: '1px solid #ccc',
                    width: '100%'
                }}
            >
                <Row justify='center' style={{ width: '100%' }}>
                    <Image
                        src={`${process.env.REACT_APP_API_URL}/images/${company.picturePath}`}
                        preview={false}
                        style={{
                            width: '8rem',
                            height: '6rem',
                            objectFit: 'contain',
                            padding: '0.2rem',
                            border: '1px solid #ccc'
                        }}
                    />
                </Row>
                <Row style={{ width: '100%', justifyContent: 'center', margin: '1rem 0' }}>
                    <Link
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            marginBottom: '0.5rem'
                        }}
                        to={`/company/${company.id}`}
                    >
                        {company.name}
                    </Link>
                    <Typography.Paragraph>
                        {company.description && shortText(company.description, 325)}
                    </Typography.Paragraph>
                </Row>
            </Row>
        </Col>
    )
}

export default CompanyItem