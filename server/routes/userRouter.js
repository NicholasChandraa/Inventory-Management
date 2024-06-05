const express = require('express');
const { register, login, forgotPassword, updateWarehouse, getUserProfile, resetPassword, updateProfile, changePassword, getDataUser, saveProfilePicture, updateProfilePicture, saveProfilePicturePath } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");
const app = express();


const router = express.Router();

// Router



// Fitur untuk upload image
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' 
    || file.mimetype === 'image/jpg' 
    || file.mimetype === 'image/jpeg' 
    || file.mimetype === 'image/svg'){
        cb(null, true);
    } else {
        cb(new Error('tipe file tidak diperbolehkan, gunakan (png, jpg, jpeg, dan svg'), false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/updateWarehouse', updateWarehouse);
router.post('/resetPassword/:token', resetPassword);
router.get('/profile', getUserProfile);
router.post('/profile/updateProfile/:id', updateProfile);
router.get('/profile/:id', getDataUser);
router.post('/profile/changePassword', changePassword);
router.post('/profile/saveProfilePicture', upload.single('profilePicture'), authMiddleware, saveProfilePicture);
router.post('/profile/saveProfilePicturePath', upload.single('profilePicture'), authMiddleware, saveProfilePicturePath);
router.post('/profile/updateProfilePicture', authMiddleware, updateProfilePicture);

router.post('/profile/uploadImage', upload.single('profilePicture'), (req, res) => {
    if(req.file) {
        const filePath = req.file.path.replace(/\\/g, "/"); //Mengubah backslashes ke forward slashes
        res.json({ filePath: `/uploads/${filePath.split('/').pop()}` });
    } else {
        res.status(400).send("Tidak ada gambar terupload atau salah tipe file")
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(500).send(err.message);
    } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500).send(err.message);
    } else {
        // Everything went fine.
        next();
    }
});


module.exports = router;