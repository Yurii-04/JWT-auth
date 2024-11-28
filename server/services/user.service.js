import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import emailService from './email.service.js';
import tokenService from './token.service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

class UserService {
    async registration(email, username, password) {
        const user = await userModel.findOne({where: {email}});
        if (user) {
            throw ApiError.BadRequest(`User with email ${email} already exist`);
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const activationLink = uuidv4();

        const newUser = await userModel.create({
            email,
            hashed_password: hashedPassword,
            username,
            activation_link: activationLink,
        });
        await emailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(newUser); // id email isActivated username
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async activate(activationLink) {
        const user = await userModel.findOne({where: {activation_link: activationLink}});
        if (!user) {
            throw new ApiError.BadRequest('Incorrect activation link');
        }

        user.is_activated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await userModel.findOne({where: {email}});
        if (!user) {
            throw ApiError.BadRequest('Incorrect email or password');
        }

        const isEqualPasswords = await bcrypt.compare(password, user.hashed_password);
        if (!isEqualPasswords) {
            throw ApiError.BadRequest('Incorrect email or password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    logout(refreshToken) {
        return tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await userModel.findByPk(userData.id)

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    getAllUsers() {
        return userModel.findAll()
    }
}

export default new UserService();