import { Col, Image, Input, Row, Typography, theme } from "antd"

import styles from './styles.module.scss';
import { MdDateRange, MdEmail } from "react-icons/md";
import styled from "styled-components";
import { BsGenderAmbiguous, BsTelephoneFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import OverView from "./OverView";
import Field from "./Field";
import { AiOutlineUpload } from "react-icons/ai";
import { useSelector } from "react-redux";

export const MyInput = styled.input`
    width: 100%;
    border: none;
    outline: none;
    color: #fff;
    background-color: transparent;

    &::placeholder {
        color: #fff;
        opacity: 0.3;
    }
`

export const MyInputRight = styled.input`
    width: 100%;
    border: none;
    outline: none;
    color: #222222;
    background-color: transparent;

    &::placeholder {
        color: #000;
        opacity: 0.3;
    }
`

const Resume = ({ cv, dispatch, viewOnly }) => {

    const themeToken = theme.useToken().token;
    const openNotification = useSelector(state => state.notification);

    return (
        <Row
            id="resume-download-page"
            className={styles.resume_container}
            style={{
                backgroundColor: themeToken.componentBackground,
                pointerEvents: viewOnly && 'none'
            }}
        >
            <Col
                className={styles.resume_container_left}
                span={8}
                style={{ backgroundColor: 'rgb(98, 98, 98)', color: '#fff' }}
            >
                <Row
                    className={styles.resume_container_left_picture}
                >
                    <Image
                        src={cv.pictureChange ? URL.createObjectURL(cv.pictureChange) : (cv.picturePath ? `${process.env.REACT_APP_API_URL}/images/${cv.picturePath}` : `${process.env.REACT_APP_CURRENT_URL}/assets/images/no_avatar.png`)}
                        width='100%'
                        height='250px'
                        preview={false}
                    />
                    <label
                        className={styles.resume_container_left_picture_button}
                        htmlFor='input_upload_cv'
                    >
                        <AiOutlineUpload style={{ marginRight: '0.5rem', fontSize: '1.5rem' }} /> Sửa ảnh
                        <Input
                            id='input_upload_cv'
                            className={styles.resume_container_left_picture_upload}
                            type='file'
                            accept=".png, .jpeg, .jpg"
                            onChange={(e) => {
                                if (e.target.files[0] && e.target.files[0].size > 800000) return openNotification('error', 'Dung lượng ảnh không được vượt quá 800KB');
                                dispatch({
                                    type: 'set_image',
                                    payload: e.target.files[0]
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row
                    className={styles.resume_container_left_info}
                >
                    <Typography.Title
                        className={styles.resume_container_left_info_title}
                        style={{ color: '#fff' }}
                    >
                        Thông tin cá nhân
                    </Typography.Title>

                    <Row
                        className={styles.resume_container_left_info_item}
                    >
                        <Col span={3} className={styles.resume_container_left_info_item_icon}>
                            <MdEmail />
                        </Col>
                        <Col span={21} className={styles.resume_container_left_info_item_input}>
                            <MyInput
                                spellCheck={false}
                                value={cv.email || ''}
                                onChange={e => dispatch({
                                    type: 'set_email',
                                    payload: e.target.value
                                })}
                                placeholder='abc2002@gmail.com'
                            />
                        </Col>
                    </Row>

                    <Row
                        className={styles.resume_container_left_info_item}
                    >
                        <Col span={3} className={styles.resume_container_left_info_item_icon}>
                            <BsGenderAmbiguous />
                        </Col>
                        <Col span={21} className={styles.resume_container_left_info_item_input}>
                            <MyInput
                                spellCheck={false}
                                value={cv.gender || ''}
                                onChange={e => dispatch({
                                    type: 'set_gender',
                                    payload: e.target.value
                                })}
                                placeholder='Nam, nữ,...'
                            />
                        </Col>
                    </Row>

                    <Row
                        className={styles.resume_container_left_info_item}
                    >
                        <Col span={3} className={styles.resume_container_left_info_item_icon}>
                            <BsTelephoneFill />
                        </Col>
                        <Col span={21} className={styles.resume_container_left_info_item_input}>
                            <MyInput
                                spellCheck={false}
                                value={cv.phone || ''}
                                onChange={e => dispatch({
                                    type: 'set_phone',
                                    payload: e.target.value
                                })}
                                placeholder='012-345-6789'
                            />
                        </Col>
                    </Row>

                    <Row
                        className={styles.resume_container_left_info_item}
                    >
                        <Col span={3} className={styles.resume_container_left_info_item_icon}>
                            <MdDateRange />
                        </Col>
                        <Col span={21} className={styles.resume_container_left_info_item_input}>
                            <MyInput
                                spellCheck={false}
                                value={cv.dob || ''}
                                onChange={e => dispatch({
                                    type: 'set_dob',
                                    payload: e.target.value
                                })}
                                placeholder='01-01-2002'
                            />
                        </Col>
                    </Row>

                    <Row
                        className={styles.resume_container_left_info_item}
                    >
                        <Col span={3} className={styles.resume_container_left_info_item_icon}>
                            <IoLocationSharp />
                        </Col>
                        <Col span={21} className={styles.resume_container_left_info_item_input}>
                            <MyInput
                                spellCheck={false}
                                value={cv.address || ''}
                                onChange={e => dispatch({
                                    type: 'set_address',
                                    payload: e.target.value
                                })}
                                placeholder='Quận A, Thành Phố B,...'
                            />
                        </Col>
                    </Row>
                </Row>
            </Col>
            <Col
                className={styles.resume_container_right}
                span={16}
            >
                <Row
                    className={styles.resume_container_right_title}
                >
                    <MyInputRight
                        spellCheck={false}
                        value={cv.fullName || ''}
                        onChange={e => dispatch({
                            type: 'set_fullName',
                            payload: e.target.value
                        })}
                        placeholder="Tên của bạn"
                        style={{ fontSize: '2rem', fontWeight: 600 }}
                    />
                    <MyInputRight
                        spellCheck={false}
                        value={cv.position || ''}
                        onChange={e => dispatch({
                            type: 'set_position',
                            payload: e.target.value
                        })}
                        placeholder='Vị trí ứng tuyển'
                        style={{ fontSize: '1.25rem' }}
                    />
                </Row>

                <OverView
                    cv={cv}
                    dispatch={dispatch}
                    type={'set_overView'}
                />

                <Field
                    name={'Kỹ năng'}
                    placeholderName={'Tên Kỹ năng'}
                    placeholderDescription={'Mô tả về kỹ năng.'}
                    cv={cv.Skills}
                    dispatch={dispatch}
                    type={'skill'}
                />

                <Field
                    name={'Học vấn'}
                    placeholderName={'Tên trường ĐH, CĐ'}
                    placeholderDescription={'Mô tả quá trình học tập và thành tích của bạn.'}
                    cv={cv.Education}
                    dispatch={dispatch}
                    type={'education'}
                />

                <Field
                    name={'Kinh nghiệm làm việc'}
                    placeholderName={'Tên công ty'}
                    placeholderDescription={'Mô tả kinh nghiệm làm việc tại công ty.'}
                    cv={cv.Experiences}
                    dispatch={dispatch}
                    type={'experience'}
                />

                <Field
                    name={'Chứng chỉ'}
                    placeholderName={'Tên chứng chỉ'}
                    placeholderDescription={'Mô tả về chứng chỉ.'}
                    cv={cv.Certifications}
                    dispatch={dispatch}
                    type={'certification'}
                />
            </Col>
        </Row>
    )
}

export default Resume;