import { Divider, Row, theme } from "antd"

import styles from './styles.module.scss';
import TextArea from "antd/es/input/TextArea";

const OverView = ({ cv, dispatch, type }) => {

    const themeToken = theme.useToken().token;

    return (
        <Row
            className={styles.resume_container_right_item}
            style={{ marginBottom: '0.5rem' }}
        >
            <Divider
                orientation="left"
                style={{ borderColor: themeToken.mainColor, margin: '0.5rem 0' }}
            >
                Giới thiệu
            </Divider>
            <TextArea
                className={styles.resume_container_right_item_input}
                autoSize={true}
                spellCheck={false}
                rows={3}
                placeholder='Phần giới thiệu bản thân thường được viết một cách ngắn gọn, linh hoạt nhằm làm nổi bật tiến trình nghề nghiệp, thành tích và các kỹ năng của bạn.'
                style={{
                    fontSize: '0.95rem',
                    whiteSpace: 'pre-wrap'
                }}
                value={cv.overView || ''}
                onChange={e => dispatch({
                    type,
                    payload: e.target.value
                })}
            ></TextArea>
        </Row>
    )
}

export default OverView