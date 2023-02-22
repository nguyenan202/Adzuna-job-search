import { Divider, Row, theme } from "antd"

import styles from './styles.module.scss';
import { MdDateRange } from "react-icons/md";
import { MyInputRight } from "./Resume";
import TextArea from "antd/es/input/TextArea";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";

const SubField = ({ placeholderName, placeholderDescription, field, dispatch, type }) => {
    return (
        <Row className={styles.resume_container_right_item_sub}>
            <BsFillTrashFill
                className={styles.resume_container_right_item_sub_icon}
                onClick={() => dispatch({
                    type: `delete_${type}`,
                    payload: field.id
                })}
            />
            {type !== 'skill' && type !== 'certification' &&
                <Row
                    className={styles.resume_container_right_item_input}
                    style={{ width: '100%', padding: '4px 11px' }}
                >
                    <MdDateRange style={{ fontSize: '1rem', color: '#222222' }} />
                    <MyInputRight
                        placeholder='01-01-2002'
                        maxLength={10}
                        spellCheck={false}
                        style={{ width: '80px', margin: '0 0.25rem', fontSize: '0.95rem' }}
                        value={field.startAt || ''}
                        onChange={(e) => dispatch({
                            type: `update_${type}_startAt`,
                            payload: {
                                id: field.id,
                                value: e.target.value
                            }
                        })}
                    />
                    -
                    <MyInputRight
                        placeholder='30-12-2023'
                        maxLength={10}
                        spellCheck={false}
                        style={{ width: '80px', margin: '0 0.25rem', fontSize: '0.95rem' }}
                        value={field.endAt || ''}
                        onChange={(e) => dispatch({
                            type: `update_${type}_endAt`,
                            payload: {
                                id: field.id,
                                value: e.target.value
                            }
                        })}
                    />
                </Row>
            }
            <Row
                className={styles.resume_container_right_item_name}
                style={{ width: '100%', padding: '4px 11px', outline: type === 'skill' && 'none', margin: type === 'skill' && '0' }}
            >
                <MyInputRight
                    placeholder={placeholderName}
                    spellCheck={false}
                    style={{ fontSize: '0.95rem', fontWeight: type === 'skill' ? 100 : 600 }}
                    value={field.name || ''}
                    onChange={(e) => dispatch({
                        type: `update_${type}_name`,
                        payload: {
                            id: field.id,
                            value: e.target.value
                        }
                    })}
                />
            </Row>
            {type !== 'skill' && <Row
                style={{ width: '100%' }}
            >
                <TextArea
                    className={styles.resume_container_right_item_input}
                    autoSize={true}
                    spellCheck={false}
                    placeholder={placeholderDescription}
                    style={{
                        fontSize: '0.95rem'
                    }}
                    value={field.description || ''}
                    onChange={(e) => dispatch({
                        type: `update_${type}_description`,
                        payload: {
                            id: field.id,
                            value: e.target.value
                        }
                    })}
                ></TextArea>
            </Row>}
        </Row>
    )
}

const Field = ({ name, placeholderName, placeholderDescription, cv, dispatch, type }) => {

    const themeToken = theme.useToken().token;

    return (
        <Row
            className={styles.resume_container_right_item}
        >
            <AiFillPlusCircle
                className={styles.resume_container_right_item_icon}
                style={{ color: themeToken.mainColor }}
                onClick={() => dispatch({
                    type: `create_${type}`
                })}
            />
            <Divider
                orientation="left"
                style={{ borderColor: themeToken.mainColor, margin: '0.5rem 0' }}
            >
                {name}
            </Divider>

            {
                cv.map(field => (
                    <SubField
                        key={field.id}
                        field={field}
                        type={type}
                        dispatch={dispatch}
                        placeholderDescription={placeholderDescription}
                        placeholderName={placeholderName}
                    />
                ))
            }

        </Row>
    )
}

export default Field