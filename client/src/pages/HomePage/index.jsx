import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "antd";
import SearchHeader from "../../components/SearchHeader";
import TopCompanies from "./TopCompanies";
import Jobs from "./Jobs";

const HomePage = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    
    return (
        <Row>
            <SearchHeader/>
            <Jobs/>
            <TopCompanies/>
        </Row>
    )
}

export default HomePage