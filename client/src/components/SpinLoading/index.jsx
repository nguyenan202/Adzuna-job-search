import { Row, Spin } from "antd"


const SpinLoading = ({ height }) => {

    return (
        <Row style={{
            height: height ? height : '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Spin />
        </Row >
    )
}

export default SpinLoading