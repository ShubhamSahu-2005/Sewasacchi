import jwt from 'jsonwebtoken';
const JWT_SECRET=process.env.JWT_SECRET;
export const generateToken=(user)=>{
    return jwt.sign({
        id:user.userID,
        role:user.role,
    },JWT_SECRET,{
        expiresIn:'7d',
        
    });
    console.log(id,role);
}
export const verifyToken=(token)=>{
    return jwt.verify(token,JWT_SECRET);
}

