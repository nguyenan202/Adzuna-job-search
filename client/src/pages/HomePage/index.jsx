import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "antd";
import { setLogout } from "../../redux/store";

const HomePage = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const logout = () => {
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/logout`,
            '_self'
        )
        dispatch(setLogout());
    }
    

    return (
        <div>
            <Row>
                <Col span={24}>
                    <h1>Home Page</h1>
                </Col>
                <Col span={24}>
                    <h2>Hello {`${user.lastName} ${user.firstName}`}</h2>
                </Col>
                <Col span={24}>
                    <img src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`} alt={user.firstName} />
                </Col>
                <Col span={24}>
                    <button onClick={logout}>log out</button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <h1>Home Page</h1>
                </Col>
                <Col span={24}>
                    <h2>Hello {`${user.lastName} ${user.firstName}`}</h2>
                </Col>
                <Col span={24}>
                    <img src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`} alt={user.firstName} />
                </Col>
                <Col span={24}>
                    <button onClick={logout}>log out</button>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage