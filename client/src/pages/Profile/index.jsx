import { Row } from "antd"
import { useState } from "react";

import NavProfile from "./NavProfile";
import MainProfile from "./MainProfile";
import useMediaQuery from '../../hooks/useMediaQuery'


const options = [
    {
        id: 0,
        name: 'Thông tin'
    },
    {
        id: 1,
        name: 'Bảo mật'
    },
    {
        id: 2,
        name: 'Công ty'
    }
]

const Profile = ({ user }) => {

    const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
    
    const breakPointTablet = useMediaQuery('(min-width: 992px)');

    return (
        <Row style={{ height: 'calc(100vh - 66px)', position: 'relative' }}>
            <NavProfile
                currentOptionIndex={currentOptionIndex}
                setCurrentOptionIndex={setCurrentOptionIndex}
                layout={breakPointTablet ? 8 : 0}
                options={options}
            />
            <MainProfile
                currentOptionIndex={currentOptionIndex}
                setCurrentOptionIndex={setCurrentOptionIndex}
                layout={breakPointTablet ? 16 : 24}
                user={user}
                options={options}
            />
        </Row>
    )
}

export default Profile