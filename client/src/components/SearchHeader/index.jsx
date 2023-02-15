import {
    Button,
    Input,
    Row,
    Select,
    Slider,
    Spin,
    Typography,
    theme
} from "antd"
import styles from './styles.module.scss'
import styled from 'styled-components'
import { IoLocationOutline, IoBuildOutline } from 'react-icons/io5'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdAttachMoney } from 'react-icons/md'
import { BsBag } from 'react-icons/bs'
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"

const Title = Typography.Title

const MySelect = styled(Select)`

    &&& {
        width: calc(100% - 1.5rem);
        font-size: 1.2rem;
        
        .ant-select-selector {
            height: 100%;
            border: none;
            box-shadow: none !important;

        }

        .ant-select-selection-item {
            display: flex;
            align-items: center;
        }

        .ant-select-selection-item {
            font-size: 1rem;
        }
        @media only screen and (max-width: 768px) {
            width: calc(100% - 1.5rem);
        }
    }
`

const MySlider = styled(Slider)`
    &&& {
        width: calc(100% - 3rem);
    }
`

const SearchHeader = ({ numberOfPost, cities, search, setSearch, loadingHome }) => {

    const [input, setInput] = useState('');
    const [salary, setSalary] = useState([0, 100]);

    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(1);
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(1);
    const [selectedCity, setSelectedCity] = useState(cities[0].name);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    
    useEffect(() => {
        try {
            const fetching = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/job`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
    
                setJobs(response.data);
            }

            setIsLoading(true)
            fetching().then(() => {
                setIsLoading(false);
            });
        }catch(err) {
            setJobs([]);
        }

    }, [])

    useEffect(() => {
        try {
            const fetching = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/specialization/${selectedJobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setSpecializations(response.data);
            }

            setIsLoading(true)
            fetching().then(() => {
                setIsLoading(false);
            });
        }catch(err) {
            setSpecializations([])
        }
    }, [selectedJobId])
    

    const handleSearchJobs = () => {
        setSearch({
            key: search.key+1,
            data: {
                value: input,
                salary,
                location: selectedCity,
                specialization: selectedSpecialization
            }
        })
    }

    return (
        <Row className={styles.container}>
            <Row className={styles.main}>
                <Title>{numberOfPost || 0} Việc Làm Dành Cho Bạn</Title>

                <Row className={styles.form}>
                    <Row
                        className={styles.form_input}
                        style={{
                            backgroundColor: themeToken.componentBackground
                        }}
                    >
                        <AiOutlineSearch />
                        <Input
                            className={styles.input}
                            placeholder='Tìm kiếm theo kỹ năng, chức vụ, công ty,...'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </Row>
                    <Row
                        className={styles.form_slider}
                        style={{
                            backgroundColor: themeToken.componentBackground
                        }}
                    >
                        <MdAttachMoney className={styles.form_slider_icon} />
                        <MySlider
                            range
                            defaultValue={salary}
                            onAfterChange={e => setSalary(e)}
                        />
                    </Row>
                </Row>

                <Row className={styles.form}>
                    <Row
                        className={styles.form_select}
                        style={{
                            backgroundColor: themeToken.componentBackground
                        }}
                    >
                        <IoLocationOutline
                            style={{
                                fontSize: '1.5rem',
                                height: '100%'
                            }}
                        />
                        <MySelect
                            className={styles.select}
                            defaultValue={selectedCity}
                            onSelect={city => setSelectedCity(city)}
                        >
                            {
                                cities.map(city => (
                                    <MySelect.Option key={city.id} value={city.name}>
                                        {city.name}
                                    </MySelect.Option>
                                ))
                            }
                        </MySelect>
                    </Row>
                    <Row
                        className={styles.form_select}
                        style={{
                            backgroundColor: themeToken.componentBackground
                        }}
                    >
                        <BsBag
                            style={{
                                fontSize: '1.5rem',
                                height: '100%'
                            }}
                        />
                        <MySelect
                            className={styles.select}
                            defaultValue={selectedJobId}
                            onSelect={id => setSelectedJobId(id)}
                        >
                            {
                                jobs.map(job => (
                                    <MySelect.Option key={job.id} value={job.id}>
                                        {job.name}
                                    </MySelect.Option>
                                ))
                            }
                        </MySelect>
                    </Row>
                    <Row
                        className={styles.form_select}
                        style={{
                            backgroundColor: themeToken.componentBackground
                        }}
                    >
                        <IoBuildOutline
                            style={{
                                fontSize: '1.5rem',
                                height: '100%'
                            }}
                        />
                        <MySelect
                            className={styles.select}
                            defaultValue={selectedSpecialization}
                            onSelect={(id) => setSelectedSpecialization(id)}
                        >
                            {
                                specializations.map(spec => (
                                    <MySelect.Option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </MySelect.Option>
                                ))
                            }
                        </MySelect>
                    </Row>
                    <Button
                        className={styles.btn}
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={handleSearchJobs}
                    >
                        Tìm kiếm
                    </Button>
                </Row>
            </Row>

            {(isLoading || loadingHome) && <Row
                className={styles.loading}
            >
                <Spin/>
            </Row>}
        </Row>
    )
}

export default SearchHeader