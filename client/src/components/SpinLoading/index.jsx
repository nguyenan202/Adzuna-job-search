import { Row, Spin } from "antd"


const SpinLoading = ({ width, height }) => {

    return (
        <Row style={{
            width: width ? width : '100vw',
            height: height ? height : '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Spin />
        </Row >
    )
}

export default SpinLoading