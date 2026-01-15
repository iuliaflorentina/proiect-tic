const jwt=require("jsonwebtoken")

const validateToken=async(req,res,next)=>{
        const authHeader=req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[0]

        if(!token){
            return res.status(401).send("No token provided")
        }
        try{
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            req.user=decoded
            next()
        }catch(err){
            res.status(403).json({
            error: 'Invalid or expired token'
        })
       
        }
        
}

module.exports={validateToken}