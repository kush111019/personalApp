const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
    
  });
  
  const upload = multer({ storage });

router.post("/uploadFile",upload.single('file'),userController.uploadFile1);
router.post("/readFile",userController.readFile1)
router.post("/readFileStream1",userController.readFile3)
router.post("/binanceApi",userController.binanceApiSocketIo)
router.post("/readFileStreamBuffer",userController.readFileWithStreamBuffer)


module.exports = router;