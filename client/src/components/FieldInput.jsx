import { Col, Input, Row, Typography } from "antd"


const FieldInput = ({ type, value, ...props }) => {


    return (
        <Row
            style={{
                margin: '1rem 0'
            }}
        >
            <Col
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
                span={6}
            >
                <Typography.Text style={{ fontSize: '1rem', fontWeight: 500 }}>
                    {type}:
                </Typography.Text>
            </Col>
            <Col
                span={18}
            >
                <Input
                    value={value}
                    {...props}
                />
            </Col>
        </Row>
    )
}

export default FieldInput