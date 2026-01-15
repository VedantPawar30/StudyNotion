const cloudinary = require('cloudinary').v2;



exports.imageUploader = async (file,folder,height,quality) => {
    try{
        const options = {folder}
        if(height){
            options.height = height
        }
        if(quality){
            options.quality = quality
        }
        options.resource_type = "auto"
        const result = await cloudinary.uploader.upload(file.tempFilePath, options)
        return result
    }
    catch(err){
        throw new Error(err.message)
    }
}

