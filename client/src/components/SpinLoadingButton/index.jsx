import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";



const SpinLoadingButton = () => {

    const antIcon = <LoadingOutlined style={{ fontSize: '1rem', color: '#fff', marginRight: '0.5rem' }} spin />;

    return(
        <Spin indicator={antIcon}/>
    )
}

export default SpinLoadingButton;