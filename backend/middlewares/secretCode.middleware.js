import Confession from '../models/confession.model.js';

const verifySecretCode = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { secretCode } = req.body;

        if(!secretCode){
            return res.status(400).json({message: "Secret Code is required!!"});
        }

        const confession = await Confession.findById(id);

        if(!confession){
            return res.status(404).json({success: false, message: "Confession not found!!"});
        }

        if(confession.secretCode !== secretCode){
            return res.status(403).json({success: false, message: "Invalid secret code!!"});
        }

        req.confession = confession;

        next();

    } catch(error){
        next(error);
    }

};

export default verifySecretCode;
