const {
    constants: {
        PHOTO_MAX_SIZE,
        PHOTO_MIMETYPES,
        DOC_MAX_SIZE,
        DOC_MIMETYPES,
        VIDEO_MAX_SIZE,
        VIDEO_MIMETYPES
    }
} = require('../constants');

module.exports = {
    checkFile: async (req, res, next) => {
        try {
            const { files } = req;

            const docs = [];
            const photos = [];
            const videos = [];

            const allFiles = Object.values(files);

            for (const file of allFiles) {
                const { name, size, mimetype } = file;

                if (DOC_MIMETYPES.includes(mimetype)) {
                    if (DOC_MAX_SIZE < size) {
                        throw new Error(`FILE ${name} is too big`);
                    }
                    docs.push(file);
                }

                switch (mimetype) {
                    case DOC_MIMETYPES.includes(mimetype):
                        if (DOC_MAX_SIZE < size) {
                            throw new Error(`FILE ${name} is too big`);
                        }
                        docs.push(file);
                        break;
                    case PHOTO_MIMETYPES.includes(mimetype):
                        if (PHOTO_MAX_SIZE < size) {
                            throw new Error(`FILE ${name} is too big`);
                        }
                        photos.push(file);
                        break;
                    case VIDEO_MIMETYPES.includes(mimetype):
                        if (VIDEO_MAX_SIZE < size) {
                            throw new Error(`FILE ${name} IS TOO BIG`);
                        }
                        videos.push(file);
                        break;
                    default:
                        throw new Error('NOT VALID FILE');
                }

                req.docs = docs;
                req.photos = photos;
                req.videos = videos;

                next();
            }
        } catch (err) {
            next(err);
        }
    },

    checkAvatar: (req, res, next) => {
        try {
            const photos = req;
            if (photos.length > 1) {
                throw new Error('You can upload only one picture');
            }

            req.avatar = photos;
            next();
        } catch (err) {
            next(err);
        }
    }
};
