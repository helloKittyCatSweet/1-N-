import Picture from '../models/Picture.js';

// 获取全部 Picture
export const getAllPictures = async (req, res) => {
    try {
        const pictures = await Picture.findAll();
        res.status(200).json(pictures);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pictures' });
    }
};

// 根据用户获取 Picture
export const getPicturesByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const userPictures = await Picture.findAll({
            where: { userId },
            include: [User]
        });
        res.status(200).json(userPictures);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pictures for the user' });
    }
};