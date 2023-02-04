import {
    Button,
    Input,
    Row,
    Select,
    Slider,
    Typography,
    theme
} from "antd"
import styles from './styles.module.scss'
import styled from 'styled-components'
import { IoLocationOutline, IoBuildOutline } from 'react-icons/io5'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdAttachMoney } from 'react-icons/md'
import { BsBag } from 'react-icons/bs'
import { useState } from "react"

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

const citis = [
    {
        id: 1,
        name: 'Hà Nội'
    },
    {
        id: 2,
        name: 'Đà Nẵng'
    },
    {
        id: 3,
        name: 'Hải Phòng'
    },
    {
        id: 4,
        name: 'TP Hồ Chí Minh'
    }
]

const SearchHeader = () => {

    const [input, setInput] = useState('');
    const [salary, setSalary] = useState([0, 100]);

    const themeToken = theme.useToken().token;

    const options = citis.map((city) => ({
        label: city.name,
        value: city.id
    }))
    

    return (
        <Row className={styles.container}>
            <Row className={styles.main}>
                <Title>953 Việc Làm Dành Cho Bạn</Title>

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
                            defaultValue={citis[0].id}
                            options={options}
                        />
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
                            defaultValue={'Tất cả ngành nghề'}
                            options={options}
                        />
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
                            defaultValue={'Tất cả lĩnh vực'}
                            options={options}
                        />
                    </Row>
                    <Button
                        className={styles.btn}
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </Row>
            </Row>
        </Row>
    )
}

export default SearchHeader