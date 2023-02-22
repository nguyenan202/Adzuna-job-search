import { Button, Modal, Row, Spin, Typography, notification, theme } from "antd"

import styles from './styles.module.scss';
import { useEffect, useReducer, useState } from "react";
import MyFieldInput from "../../components/MyFieldInput";
import DatePickField from "../../components/DatePickField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";
import useMediaQuery from "../../hooks/useMediaQuery";
import axios from "axios";
import { useSelector } from "react-redux";
import postReducer from "./postReducer";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: '1rem', color: '#fff', marginRight: '0.5rem' }} spin />;

export const genders = [
    {
        id: 1,
        name: 'Nam'
    },
    {
        id: 2,
        name: 'Nữ'
    },
    {
        id: 3,
        name: 'Không yêu cầu'
    }
]

const initState = {
    title: {
        error: false,
        value: ''
    },
    startAt: new Date().toISOString().slice(0, 10),
    endAt: {
        error: false,
        value: null
    },
    salary: {
        error: false,
        value: null
    },
    quantity: {
        error: false,
        value: null
    },
    gender: {
        error: false,
        value: null
    },
    specializationId: {
        error: false,
        value: null
    },
    workingTimeId: {
        error: false,
        value: null
    },
    levelId: {
        error: false,
        value: null
    },
    experiencePostId: {
        error: false,
        value: null
    },
    description: {
        error: false,
        value: ''
    },
    requirments: {
        error: false,
        value: ''
    },
    benefits: {
        error: false,
        value: ''
    }
}

const UpPost = ({ numberPostUp, company, keyReRender, setKeyReRender }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [showModalLimit, setShowModalLimit] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [jobIdSelected, setJobIdSelected] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [workingTimes, setWorkingTimes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState(null);
    const [state, dispatch] = useReducer(postReducer, initState);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const openNotificationWithIcon = useSelector(state => state.notification);

    const breakPointTablet = useMediaQuery('(max-width: 692px)');

    useEffect(() => {
        const fetching = async () => {
            const response_jobs = await axios.get(`${process.env.REACT_APP_API_URL}/job`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response_workingTimes = await axios.get(`${process.env.REACT_APP_API_URL}/working-time`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response_levels = await axios.get(`${process.env.REACT_APP_API_URL}/level`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response_experiences = await axios.get(`${process.env.REACT_APP_API_URL}/experience-post`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response_addresses = await axios.get(`${process.env.REACT_APP_API_URL}/company/address/${company.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setJobs(response_jobs.data);
            setWorkingTimes(response_workingTimes.data);
            setLevels(response_levels.data);
            setExperiences(response_experiences.data);
            setAddresses(response_addresses.data)
        }

        fetching();
    }, [])

    useEffect(() => {
        const fetching = async () => {
            const response_specialization = await axios.get(`${process.env.REACT_APP_API_URL}/specialization/${jobIdSelected}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSpecializations(response_specialization.data);
        }

        jobIdSelected && fetching();
    }, [jobIdSelected])

    const handleSubmit = async () => {
        const objArr = Object.entries(state).filter(([key, value]) => key !== 'startAt');

        // Check all field is Oke with field not event change
        const isAllFieldOke_1 = !objArr.some(([key, value]) => !value.error && (value.value === '' || !value.value));
        // Check all field have no error
        const isAllFieldOke_2 = objArr.every(([key, value]) => !value.error);
        // Check addresses not empty
        const isAllFieldOke_3 = selectedAddresses ? selectedAddresses.length > 0 : false;

        // if error
        if (!isAllFieldOke_1) {
            objArr.forEach(([key, value]) => {
                (!value.error && (value.value === '' || !value.value)) && dispatch({
                    type: `update-${key}`,
                    payload: null
                })
            })
        }

        if (!isAllFieldOke_3) {
            setSelectedAddresses([]);
        }

        if (isAllFieldOke_1 && isAllFieldOke_2 && isAllFieldOke_3) {
            const objArr = Object.entries(state);
            // Remove error, just keep value
            const newObjArr = objArr.map(([key, value]) => [key, typeof value === 'string' ? value : value.value])

            // Process Array to Object
            let data = newObjArr.reduce((cur, next) => ({
                ...cur,
                [next[0]]: next[1]
            }), {})

            //Format salary
            data = {
                ...data,
                quantity: parseInt(data.quantity),
                companyId: company.id
            }

            try {
                setIsLoading(true);
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/post`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })


                if (response.data.status) {
                    const response_postAddress = await axios.post(`${process.env.REACT_APP_API_URL}/post-address`, {
                        postId: response.data.post.id,
                        data: selectedAddresses
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (response_postAddress.data.status) {
                        openNotificationWithIcon('success', 'Đăng tin thành công, vui lòng đợi duyệt');
                        setShowModalLimit(false);
                        setKeyReRender(keyReRender + 1);
                    }
                }
            } catch (err) {
                openNotificationWithIcon('error', 'Có lỗi vui lòng thử lại sau');
            }

            setIsLoading(false);
        }
    }

    return (
        <Row
            className={styles.sub_container}
            style={{
                backgroundColor: themeToken.componentBackground
            }}
        >

            <Row
                className={styles.full_width}
                justify='center'
            >
                <Typography.Title>
                    Đăng tin tuyển dụng
                </Typography.Title>
            </Row>

            <Row
                className={styles.full_width}
                justify='space-between'
            >
                <MyFieldInput
                    field='Tiêu đề'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Chuyên Viên Lập Trình (PHP Laravel Developer)'
                    value={state.title.value}
                    onChange={e => dispatch({
                        type: 'update-title',
                        payload: e.target.value
                    })}
                    span={24}
                    isInvalidMessage={state.title.error && 'Không được bỏ trống trường này'}
                />

                <DatePickField
                    field='Hạn nộp hồ sơ'
                    fieldSize='1.2rem'
                    size='large'
                    span={breakPointTablet ? 24 : 11}
                    name='dob'
                    onChange={(e) => dispatch({
                        type: 'update-endAt',
                        payload: e && e.toISOString().slice(0, 10)
                    })}
                    isInvalidMessage={state.endAt.error && 'Không được bỏ trường này'}
                />

                <MyFieldInput
                    field='Mức lương'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='Triệu VNĐ'
                    type='number'
                    min='0'
                    addonAfter={<>Triệu VNĐ</>}
                    span={breakPointTablet ? 24 : 11}
                    value={state.salary.value}
                    onChange={e => dispatch({
                        type: 'update-salary',
                        payload: e.target.value
                    })}
                    isInvalidMessage={state.salary.error && 'Không được bỏ trường này'}
                />

                <MyFieldInput
                    field='Số lương cần tuyển'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g 99 người'
                    type='number'
                    min='1'
                    span={breakPointTablet ? 24 : 11}
                    value={state.quantity.value}
                    onChange={e => dispatch({
                        type: 'update-quantity',
                        payload: e.target.value
                    })}
                    isInvalidMessage={state.quantity.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Giới tính'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Nam, Nữ'
                    data={genders}
                    span={breakPointTablet ? 24 : 11}
                    onSelect={id => dispatch({
                        type: 'update-gender',
                        payload: id
                    })}
                    isInvalidMessage={state.gender.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Ngành nghề'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Công nghệ thông tin'
                    data={jobs}
                    onSelect={id => setJobIdSelected(id)}
                    showSearch
                    span={breakPointTablet ? 24 : 11}
                />

                <SelectField
                    field='Lĩnh vực'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Kỹ sư phần mềm'
                    data={specializations}
                    showSearch
                    span={breakPointTablet ? 24 : 11}
                    onSelect={id => dispatch({
                        type: 'update-specializationId',
                        payload: id
                    })}
                    isInvalidMessage={state.specializationId.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Hình thức làm việc'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Toàn thời gian'
                    data={workingTimes}
                    showSearch
                    span={breakPointTablet ? 24 : 11}
                    onSelect={id => dispatch({
                        type: 'update-workingTimeId',
                        payload: id
                    })}
                    isInvalidMessage={state.workingTimeId.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Cấp độ'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Thực tập sinh'
                    data={levels}
                    showSearch
                    span={breakPointTablet ? 24 : 11}
                    onSelect={id => dispatch({
                        type: 'update-levelId',
                        payload: id
                    })}
                    isInvalidMessage={state.levelId.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Kinh nghiệm'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g 2 năm kinh nghiệm'
                    data={experiences}
                    showSearch
                    span={breakPointTablet ? 24 : 11}
                    onSelect={id => dispatch({
                        type: 'update-experiencePostId',
                        payload: id
                    })}
                    isInvalidMessage={state.experiencePostId.error && 'Không được bỏ trường này'}
                />

                <SelectField
                    field='Địa điểm làm việc'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='e.g Hà Nội, TP Hồ Chí Minh,...'
                    data={addresses}
                    mode='multiple'
                    onChange={e => setSelectedAddresses(e)}
                    span={24}
                    isInvalidMessage={selectedAddresses && selectedAddresses.length === 0 && 'Không được để trống trường này'}
                />

                <TextAreaField
                    field='Mô tả công việc'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='Mô tả về công việc cần tuyển'
                    rows={5}
                    span={24}
                    value={state.description.value}
                    onChange={e => dispatch({
                        type: 'update-description',
                        payload: e.target.value
                    })}
                    isInvalidMessage={state.description.error && 'Không được bỏ trường này'}
                />

                <TextAreaField
                    field='Yêu cầu ứng viên'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='Yêu cầu về công việc cần tuyển'
                    rows={5}
                    span={24}
                    value={state.requirments.value}
                    onChange={e => dispatch({
                        type: 'update-requirments',
                        payload: e.target.value
                    })}
                    isInvalidMessage={state.requirments.error && 'Không được bỏ trường này'}
                />

                <TextAreaField
                    field='Quyền lợi'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='Quyền lợi dành cho người ứng tuyển'
                    rows={5}
                    span={24}
                    value={state.benefits.value}
                    onChange={e => dispatch({
                        type: 'update-benefits',
                        payload: e.target.value
                    })}
                    isInvalidMessage={state.benefits.error && 'Không được bỏ trường này'}
                />
            </Row>

            <Row
                className={styles.full_width}
                style={{
                    margin: '1rem 0',
                    justifyContent: 'center'
                }}
            >
                <Button
                    size="large"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: breakPointTablet ? '100%' : '200px',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        opacity: (!numberPostUp > 0 || isLoading) && '0.8'
                    }}
                    disabled={!numberPostUp > 0 || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading && <Spin indicator={antIcon} />} Đăng tin
                </Button>
            </Row>

            {/* Modal limit up post */}
            {numberPostUp && <Modal
                open={showModalLimit}
                onCancel={() => setShowModalLimit(false)}
                onOk={() => setShowModalLimit(false)}
                width='720px'
            >
                <Typography.Title>
                    Thông báo
                </Typography.Title>
                <Typography.Paragraph
                    style={{
                        fontSize: '1rem'
                    }}
                >
                    Bạn hiện còn <strong style={{ color: 'red' }}>{numberPostUp}</strong> lượt đăng bài trong tháng
                </Typography.Paragraph>
            </Modal>}
        </Row>
    )
}

export default UpPost;