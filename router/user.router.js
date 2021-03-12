const router = require('express').Router();
const userController = require('../controller/user.controller');
const { authMiddleware, userMiddleware, fileMiddleware } = require('../middleware');

router.get('/',
    userController.getAllUsers);

router.get('/:userId',
    userMiddleware.checkValidId,
    userController.getSingleUser);

router.post('/',
    fileMiddleware.checkFile,
    fileMiddleware.checkAvatar,
    userMiddleware.areUserDataOk,
    userController.addNewUser);

router.delete('/:userId',
    authMiddleware.checkAccessTokenMiddleware,
    userController.deleteUser);

module.exports = router;
