import jwt from "jsonwebtoken"
import { UnauthenticatedError } from "../error/index.js"

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader) throw new UnauthenticatedError('Authentication Failed')

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload);
        req.user = {userId: payload.userId}
        next()
    } catch (error) {
        throw new UnauthenticatedError(`Authentication Failed. Reason: ${error.msg}`)
    }
}

export default auth