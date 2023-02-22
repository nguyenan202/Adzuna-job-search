import { Row, Typography } from "antd"


const PageMessage = ({ message }) => {

    return (
        <Row
            style={{
                height: 'calc(100vh - 66px)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography.Title>
                {message}
            </Typography.Title>
        </Row>
    )
}

export default PageMessage