import userService from '../services/user.service.js';
import {validationResult} from 'express-validator';
import ApiError from '../exceptions/api-error.js';

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const {email, password, username} = req.body;
            const userData = await userService.registration(email, username, password);
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json({message: 'Success logout'})
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();