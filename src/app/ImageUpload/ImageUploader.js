const AWS = require('aws-sdk')
const multer = require('multer')
const multers3 = require('multer-s3')
const path = require('path')

module.exports= function(app) {


    AWS.config.update({
        region : 'ap-northeast-2',
        accessKeyId : 'AKIAYN2PQASTA2HIO3FC',
        secretAccessKey : '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',
    });

    const s3 = new AWS.S3()

    const allowedExtensions = ['.png', '.jpg','.jpeg','.bmp']

    const imageUploader = multer({
        storage: multers3({
            s3 : s3,
            bucket: 'kbcontestgreenus',
            key : (req,file,callback) => {
                const uploadDirectory = req.query.directory ?? ''
                const extension = path.extname(file.originalname)
                if (!allowedExtensions.includes(extension)) {
                    return callback(new Error('wrong extension'))
                }
                callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`)
            },
            acl:'public-read-write'
        })
    })

    app.post('/app/test/image', imageUploader.single('image'), (req,res)=>{
            res.send(req.file);
        })
};

