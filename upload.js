const multer = require('multer');
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region : 'ap-northease-2',
    accessKeyId : 'AKIAYN2PQASTA2HIO3FC',
    secretAccessKey : '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',
});

const upload = multer({
    storage:multerS3({
        s3 : s3,
        bucket: 'kbcontestgreenus',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key : (req,file,cb) => {
            cb(null, `uploads/${Date.now()}_${file.originalname}`)
        }
    })
});

module.exports = upload;
