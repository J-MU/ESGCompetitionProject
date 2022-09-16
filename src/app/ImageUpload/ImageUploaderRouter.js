const user = require("../User/userController");
const controller = require('./ImageUploader');
module.exports = function(app) {

    console.log('이미지라우터')
    app.post('/app/test/image',
        controller.imageUploader.single('image'), (req,res)=>{
        res.send('good!')
    })

};