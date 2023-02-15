import { Row } from "antd"
import LevelSetting from "./LevelSetting"
import ExperiencePost from "./ExperiencePost"
import WorkingTimeSetting from "./WorkingTimeSetting"
import JobsPost from "./JobsPost"


const PostSetting = () => {
    
    return(
        <Row
            style={{
                width: '100%'
            }}
        >
            <LevelSetting/>
            <ExperiencePost/>
            <WorkingTimeSetting/>
            <JobsPost/>
        </Row>
    )
}

export default PostSetting