import Priority from "../models/priority";



const getAllPiority = async (_, res) => {
    try{
        const piorities = await Priority.findAll();

        res.status(200).json(piorities);
    }catch(err) {
        res.status(500).json({ message: err });
    }
}


export {
    getAllPiority
}