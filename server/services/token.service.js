import jwt from 'jsonwebtoken';
import tokenModel from '../models/token.model.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'});

        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({where: {user_id: userId}});
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            return tokenData.save();
        }
        return tokenModel.create({user_id: userId, refresh_token: refreshToken});
    }

    removeToken(refreshToken) {
        return tokenModel.destroy({where: {refresh_token: refreshToken}})
    }

    async findToken(refreshToken) {
        return tokenModel.findOne({where: {refresh_token: refreshToken}})
    }
}

export default new TokenService();