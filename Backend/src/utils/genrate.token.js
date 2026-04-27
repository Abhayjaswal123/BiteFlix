import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import  config  from '../config/config.js';

export const refreshTokenFunction = (user, userType) => {
    const userId = user?._id || user?.id;
    return jwt.sign({id: userId, userType},
        config.REFRESH_JWT_SECRET, {
            expiresIn : "7d"
        }
    )
}

export const accessTokenFunction = (user,session) => {
    const userId = user?._id || user?.id;
    return jwt.sign({
        id: userId,
        userType: session.userType,
        sessionId :session._id
    },
        config.ACCESS_JWT_SECRET, {
            expiresIn : "15m"
        }
    )
}

export let hash = (val) => { return  crypto.createHash('sha256').update(val).digest('hex') }