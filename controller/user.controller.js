const fs = require('fs-extra').promises();
const path = require('path');
const uuid = require('uuid').v1;

const errorMessage = require('../error/error.messages');
const errorCodes = require('../constants/error.codes');

const { emailActionsEnum } = require('../constants');
const { passHash } = require('../helpers');
const { userService, mailService } = require('../service');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.findAllUsers();

            res.json(users);
        } catch (e) {
            res.status(errorCodes.BAD_REQUEST).json(e.message);
        }
    },

    getSingleUser: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await userService.findUserById(userId);

            res.json(user);
        } catch (e) {
            res.status(errorCodes.BAD_REQUEST).json(e.message);
        }
    },

    addNewUser: async (req, res) => {
        try {
            const { preferLanguage = 'en' } = req.query;
            const { body: { password, email }, avatar } = req;

            const hashPassword = await passHash.hash(password);

            const fullUser = await userService.createUser({ ...req.body, password: hashPassword });

            if (avatar) {
                const { photoPath, pathToStatic, uploadUser } = _photoBuilder(avatar.name, 'photos', fullUser._id);

                await fs.mkdir(pathToStatic, { recursive: true });

                await avatar.mv(photoPath);

                await userService.updateUser(fullUser._id, uploadUser);
            }

            await mailService.sendEmail(email, emailActionsEnum.USER_CREATED, { userName: email });

            res.status(errorCodes.CREATED).json(errorMessage.USER_CREATED[preferLanguage]);
        } catch (error) {
            res.status(errorCodes.BAD_REQUEST).json(error.message);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const { preferLanguage = 'en' } = req.query;
            const { tokens } = req;
            console.log(tokens._id);
            console.log(userId);
            if (userId.toString() !== tokens._id.toString()) {
                throw new Error(errorMessage.USER_UNAUTHORIZED);
            }

            await mailService.sendEmail(tokens.email, emailActionsEnum.USER_DELETED, { username: tokens.name });

            await userService.deleteUserById(userId);

            res.json(errorMessage.USER_DELETED[preferLanguage]);
        } catch (err) {
            res.status(errorCodes.BAD_REQUEST).json(err.message);
        }
    }
};

function _photoBuilder(docName, itemType, itemId) {
    const pathInStatic = path.join('user', `${itemId}`, 'photos');
    const pathToStatic = path.join(process.cwd(), 'static', pathInStatic);
    const fileFormat = docName.name.split('.').pop();
    const photoBaseName = `${uuid()}.${fileFormat}`;
    const photoPath = path.join(pathToStatic, photoBaseName);
    const uploadUser = path.join(pathInStatic, photoPath);

    return { uploadUser, photoPath, pathToStatic };
}
