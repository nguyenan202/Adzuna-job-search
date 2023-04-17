import { Row, Typography } from "antd"



const MessagePage = ({ title }) => {

    return(
        <Row
            style={{
                width: '100%',
                height: 'calc(100vh - 67px)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography.Title>
                { title }
            </Typography.Title>
        </Row>
    )
}

export default MessagePage