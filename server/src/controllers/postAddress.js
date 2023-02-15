
import PostAddress from '../models/postAddress';

const createPostAddress = async (req, res) => {
    try{
        const {
            postId,
            data
        } = req.body

        for(let addressId of data) {
            await PostAddress.create({
                postId,
                addressId
            })
        }

        res.status(200).json({
            status: true,
            message: 'Thành công.'
        })
    }catch(err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

export {
    createPostAddress
}