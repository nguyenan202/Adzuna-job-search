import { Button, Row, Typography, theme } from "antd"

import styles from './styles.module.scss';
import { BsArrowLeft } from "react-icons/bs";
import MyFieldInput from "../../../components/MyFieldInput";
import { useEffect, useState } from "react";
import SelectField from "../../../components/SelectField";
import { genders } from "../../UpPostPage/UpPost";
import axios from "axios";
import { useSelector } from "react-redux";
import SpinLoading from "../../../components/SpinLoading";
import TextAreaField from "../../../components/TextAreaField";

const InfoPost = ({ post, setSelected, keyReRender, setKeyReRender }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [jobIdSelected, setJobIdSelected] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [workingTimes, setWorkingTimes] = useState([]);
    const [levels, setLevels] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [showSave, setShowSave] = useState(false);
    const [state, setState] = useState({
        title: {
            value: post.title,
            error: false
        },
        salary: {
            value: post.salary,
            error: false
        },
        quantity: {
            value: post.quantity,
            error: false
        },
        gender: {
            value: post.gender,
            error: false
        },
        specializationId: {
            value: post.Specialization.id,
            error: false
        },
        workingTimeId: {
            value: post.WorkingTime.id,
            error: false
        },
        levelId: {
            value: post.Level.id,
            error: false
        },
        experiencePostId: {
            value: post.ExperiencePost.id,
            error: false
        },
        description: {
            value: post.description,
            error: false
        },
        requirments: {
            value: post.requirments,
            error: false
        },
        benefits: {
            value: post.benefits,
            error: false,
        }
    });

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const openNotification = useSelector(state => state.notification);

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

            if (response_jobs.status === 200 && response_workingTimes.status === 200 && response_levels.status === 200 && response_experiences.status === 200) {
                setJobs([...response_jobs.data]);
                setJobIdSelected([...response_jobs.data].find(job => job.Specializations.find(spec => spec.id === state.specializationId.value)).id)
                setWorkingTimes([...response_workingTimes.data]);
                setLevels([...response_levels.data]);
                setExperiences([...response_experiences.data]);
            }
        }

        try {
            setIsLoading(true);
            fetching().finally(() => {
                setIsLoading(false);
            })
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => {
        const fetching = async () => {
            const response_specialization = await axios.get(`${process.env.REACT_APP_API_URL}/specialization/${jobIdSelected}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSpecializations(response_specialization.data);
        }

        fetching();
    }, [token, jobIdSelected])


    const handleSave = async () => {
        const objArr = Object.entries(state);

        let newState = {...state};
        objArr.forEach(([key, value]) => {
            if (value.value === '' || value.value < 0) {
                newState[key] = {
                    error: true,
                    value: value.value
                }
            }
        });
        setState(newState);

        // Check all field error
        if (Object.entries(newState).every(([key, value]) => !value.error)) {
            const objArr = Object.entries(newState).map(([key,value]) => ({[key]: value.value}));
            const data = {
                data: Object.assign(...objArr),
                postId: post.id
            };

            try {
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/post`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    openNotification('success', response.data.message);
                    setKeyReRender(keyReRender+1);
                }
            }catch(err) {
                openNotification('error', err.response.message.message);
            }
        }
    }
    
    return (isLoading ?
        <SpinLoading /> :
        <Row
            className={styles.container_info}
        >
            <BsArrowLeft
                className={styles.back_icon}
                onClick={() => setSelected(null)}
            />
            <Row
                className={styles.header}
            >
                <MyFieldInput
                    span={24}
                    field='Tiêu đề'
                    fieldSize='1.2rem'
                    size='large'
                    isInvalidMessage={state.title.error && 'Tiêu đề không được trống'}
                    value={state.title.value}
                    onChange={e => {
                        setState({
                            ...state,
                            title: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <MyFieldInput
                    span={11}
                    field='Lương'
                    fieldSize='1.2rem'
                    size='large'
                    type='number'
                    min='0'
                    addonAfter={<>Triệu VNĐ</>}
                    isInvalidMessage={state.salary.error && 'Lương không được trống và phải là số >= 0'}
                    value={state.salary.value}
                    onChange={e => {
                        setState({
                            ...state,
                            salary: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <MyFieldInput
                    span={11}
                    field='Số lượng cần tuyển'
                    fieldSize='1.2rem'
                    type='number'
                    min='0'
                    size='large'
                    isInvalidMessage={state.quantity.error && 'Số lượng không được trống và phải là số >= 0'}
                    value={state.quantity.value}
                    onChange={e => {
                        setState({
                            ...state,
                            quantity: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <SelectField
                    span={11}
                    field='Giới tính'
                    fieldSize='1.2rem'
                    size='large'
                    data={genders}
                    defaultValue={state.gender.value}
                    isInvalidMessage={state.gender.error && 'Trường không hợp lệ'}
                    onSelect={id => {
                        setState({
                            ...state,
                            gender: {
                                error: false,
                                value: id
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                {jobs.length > 0 && <SelectField
                    span={11}
                    field='Ngành nghề'
                    fieldSize='1.2rem'
                    size='large'
                    data={jobs}
                    defaultValue={jobIdSelected}
                    onSelect={id => setJobIdSelected(id)}
                />}
                <SelectField
                    span={11}
                    field='Lĩnh vực'
                    fieldSize='1.2rem'
                    size='large'
                    data={specializations}
                    defaultValue={state.specializationId.value}
                    onSelect={id => {
                        setState({
                            ...state,
                            specializationId: {
                                error: false,
                                value: id
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <SelectField
                    span={11}
                    field='Hình thức làm việc'
                    fieldSize='1.2rem'
                    size='large'
                    data={workingTimes}
                    defaultValue={state.workingTimeId.value}
                    onSelect={id => {
                        setState({
                            ...state,
                            workingTimeId: {
                                error: false,
                                value: id
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <SelectField
                    span={11}
                    field='Cấp độ'
                    fieldSize='1.2rem'
                    size='large'
                    data={levels}
                    defaultValue={state.levelId.value}
                    onSelect={id => {
                        setState({
                            ...state,
                            levelId: {
                                error: false,
                                value: id
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <SelectField
                    span={11}
                    field='Kinh nghiệm'
                    fieldSize='1.2rem'
                    size='large'
                    data={experiences}
                    defaultValue={state.experiencePostId.value}
                    onSelect={id => {
                        setState({
                            ...state,
                            experiencePostId: {
                                error: false,
                                value: id
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <TextAreaField
                    span={24}
                    field='Mô tả công việc'
                    fieldSize='1.2rem'
                    rows={5}
                    spellCheck={false}
                    size='large'
                    placeholder='Mô tả về công việc cần tuyển'
                    value={state.description.value}
                    isInvalidMessage={state.description.error && 'Không được bỏ trường này'}
                    onChange={e => {
                        setState({
                            ...state,
                            description: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <TextAreaField
                    span={24}
                    field='Yêu cầu ứng viên'
                    fieldSize='1.2rem'
                    rows={5}
                    spellCheck={false}
                    size='large'
                    placeholder='Yêu cầu về công việc cần tuyển'
                    value={state.requirments.value}
                    isInvalidMessage={state.requirments.error && 'Không được bỏ trường này'}
                    onChange={e => {
                        setState({
                            ...state,
                            requirments: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <TextAreaField
                    field='Quyền lợi'
                    fieldSize='1.2rem'
                    size='large'
                    placeholder='Quyền lợi dành cho người ứng tuyển'
                    spellCheck={false}
                    rows={5}
                    span={24}
                    value={state.benefits.value}
                    isInvalidMessage={state.benefits.error && 'Không được bỏ trường này'}
                    onChange={e => {
                        setState({
                            ...state,
                            benefits: {
                                error: false,
                                value: e.target.value
                            }
                        })
                        !showSave && setShowSave(true);
                    }}
                />
            </Row>

            {showSave && <Row
                style={{
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <Button
                    size="large"
                    style={{
                        width: '200px',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={handleSave}
                >
                    Lưu lại
                </Button>
            </Row>}
        </Row>
    )
}

export default InfoPost;