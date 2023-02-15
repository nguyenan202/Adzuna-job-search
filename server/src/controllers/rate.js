import Rate from "../models/rate";

const createRate = async (req, res) => {
    try{
        const {
            star,
            comment,
            companyId,
            userId
        } = req.body;

        const rateFind = await Rate.findOne({
            where: {
                userId,
                companyId
            }
        })
        
        // Check người dùng đã đánh giá công ty chưa
        if (rateFind) return res.status(201).json({
            status: true,
            message: 'Người dùng chỉ được đánh giá công ty 1 lần'
        })

        const rate = await Rate.create({
            star,
            comment,
            companyId,
            userId
        })

        if (rate) return res.status(200).json({
            status: true,
            rate
        })

        res.status(200).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }catch(err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

export {
    createRate
}