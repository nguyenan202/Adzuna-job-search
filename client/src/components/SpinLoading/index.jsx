import { Row, Spin } from "antd"



const SpinLoading = () => {

    return (
        <Row style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Spin />
        </Row >
    )
}

export default SpinLoading