import { Col, Image, Row, Typography, theme } from "antd";
import { MyTitle } from "../CompanyPage/DetailCompany";

import styles from './styles.module.scss';
import useMediaQuery from "../../hooks/useMediaQuery";
import { BiWorld } from "react-icons/bi";
import { FaHospitalUser, FaMedal, FaMoneyBillWave } from "react-icons/fa";
import { VscPerson } from 'react-icons/vsc';
import { Link } from "react-router-dom";
import { MdOutlineHomeWork } from "react-icons/md";
import { RiUserStarFill } from 'react-icons/ri';
import { genders } from "../UpPostPage/UpPost";

const MyItem = ({ icon, title, value, span }) => {

    return (
        <Col span={span} style={{ margin: '0.5rem 0' }}>
            <Row style={{ width: '100%' }}>
                <Col span={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {icon}
                </Col>
                <Col span={19}>
                    <Row style={{ width: '100%' }}>
                        <Typography.Title style={{ fontSize: '1.1rem', margin: 0 }}>
                            {title}
                        </Typography.Title>
                    </Row>
                    <Row style={{ width: '100%' }}>
                        <Typography.Paragraph style={{ fontSize: '1rem', margin: 0 }}>
                            {value}
                        </Typography.Paragraph>
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}

const DetailPost = ({ post }) => {

    const themeToken = theme.useToken().token;

    const breakpointMobile = useMediaQuery('(max-width: 576px)');
    const breakpointTablet = useMediaQuery('(max-width: 762px)');
    
    const listAddress = post.PostAddresses.map((address,index) => (
        <Typography.Paragraph key={index} style={{ width: '100%', fontSize: '1rem' }}>
            {`• ${address.Address.name}`}
        </Typography.Paragraph>
    ))

    return (
        <Row
            className={styles.detail_company}
            justify='space-between'
        >
            {/* Left */}
            <Col
                className={styles.detail_company_left}
                span={breakpointTablet ? 24 : 16}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row style={{ padding: '1rem' }}>
                    <MyTitle
                        color={themeToken.mainColor}
                        text='Chi tiết tuyển dụng'
                    />
                    <Row
                        className={styles.info}
                    >
                        <Row
                            style={{
                                width: '100%'
                            }}
                        >
                            <Typography.Paragraph style={{ fontSize: '1rem', fontWeight: 500, margin: 0, textDecoration: 'underline' }}>
                                Thông tin chung
                            </Typography.Paragraph>
                        </Row>
                        <MyItem
                            icon={<FaMoneyBillWave style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Mức lương'
                            value={`${post.salary} Triệu VNĐ`}
                            span={12}
                        />
                        <MyItem
                            icon={<VscPerson style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Số lượng cần tuyển'
                            value={`${post.quantity} người`}
                            span={12}
                        />
                        <MyItem
                            icon={<MdOutlineHomeWork style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Hình thức làm việc'
                            value={post.WorkingTime.name}
                            span={12}
                        />
                        <MyItem
                            icon={<FaMedal style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Cấp bậc'
                            value={post.Level.name}
                            span={12}
                        />
                        <MyItem
                            icon={<FaMedal style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Giới tính'
                            value={genders.find(gender => gender.id === post.gender).name}
                            span={12}
                        />
                        <MyItem
                            icon={<RiUserStarFill style={{ fontSize: '2rem', color: themeToken.mainColor }} />}
                            title='Kinh nghiệm'
                            value={post.ExperiencePost.name}
                            span={12}
                        />
                    </Row>

                    <Row
                        className={styles.info}
                    >
                        <Row
                            style={{
                                width: '100%'
                            }}
                        >
                            <Typography.Paragraph style={{ fontSize: '1rem', fontWeight: 500, margin: 0, textDecoration: 'underline' }}>
                                Địa điểm làm việc
                            </Typography.Paragraph>
                        </Row>
                        <Row
                            style={{ margin: '0.5rem 0' }}
                        >
                            {listAddress}
                        </Row>
                    </Row>
                </Row>
                <Row
                    style={{ padding: '1rem' }}
                >
                    <MyTitle
                        color={themeToken.mainColor}
                        text='Mô tả công việc'
                    />
                    <Row
                        className={styles.description_company}
                    >
                        {
                            post.description.split('\n').map((line, i) => <Typography.Paragraph key={i} style={{ fontSize: '1rem' }}>{line}</Typography.Paragraph>)
                        }
                    </Row>
                </Row>
                <Row
                    style={{ padding: '1rem' }}
                >
                    <MyTitle
                        color={themeToken.mainColor}
                        text='Yêu cầu ứng viên'
                    />
                    <Row
                        className={styles.description_company}
                    >
                        {
                            post.requirments.split('\n').map((line, i) => <Typography.Paragraph key={i} style={{ fontSize: '1rem' }}>{line}</Typography.Paragraph>)
                        }
                    </Row>
                </Row>
                <Row
                    style={{ padding: '1rem' }}
                >
                    <MyTitle
                        color={themeToken.mainColor}
                        text='Quyền lợi'
                    />
                    <Row
                        className={styles.description_company}
                    >
                        {
                            post.benefits.split('\n').map((line, i) => <Typography.Paragraph key={i} style={{ fontSize: '1rem' }}>{line}</Typography.Paragraph>)
                        }
                    </Row>
                </Row>
            </Col>

            {/* Right */}
            <Col
                className={styles.rate_company}
                span={breakpointTablet ? 24 : 7}
            >
                <Row
                    style={{
                        backgroundColor: themeToken.componentBackground,
                        marginTop: breakpointTablet && '1.5rem',
                        padding: '1rem'
                    }}
                >
                    <Row style={{ width: '100%' }}>
                        <Typography.Title style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                            Công ty
                        </Typography.Title>
                    </Row>
                    <Row style={{ width: '100%', justifyContent: 'center', margin: '1rem 0' }}>
                        <Image
                            src={`${process.env.REACT_APP_API_URL}/images/${post.Conpany.picturePath}`}
                            style={{
                                width: '10rem',
                                height: '10rem',
                                objectFit: 'contain',
                                border: '1px solid #ccc',
                                padding: '0.2rem'
                            }}
                            preview={false}
                        />
                    </Row>
                    <Row style={{ width: '100%' }}>
                        <Link
                            style={{ fontSize: '1.5rem', width: '100%', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}
                            to={`/company/${post.Conpany.id}`}
                        >
                            {post.Conpany.name}
                        </Link>
                    </Row>
                    <Row>
                        <Col
                            span={24}
                        >
                            <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem', opacity: '0.8' }}>
                                <BiWorld style={{ marginRight: '0.5rem' }} />
                                <a href={post.Conpany.url} target="_blank">{post.Conpany.url}</a>
                            </Typography.Paragraph>
                        </Col>
                        <Col
                            span={24}
                        >
                            <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem', opacity: '0.8' }}>
                                <FaHospitalUser style={{ marginRight: '0.5rem' }} />
                                {`${post.Conpany.size} nhân viên`}
                            </Typography.Paragraph>
                        </Col>
                    </Row>
                </Row>

            </Col>
        </Row>
    )
}

export default DetailPost;