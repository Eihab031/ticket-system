import jwt from 'jsonwebtoken'

const jwtToken= (id)=>{
//Sign a new Token using User's Id and Secret Key from .env
return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'10d'});
};
export default jwtToken;