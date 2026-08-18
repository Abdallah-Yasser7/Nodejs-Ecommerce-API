const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOption = () => {
  // 1- DiskStorage engine
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/categories')
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1]
  //     const filename = `category-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
  //     cb(null, filename)
  //   }
  // })

  // 2- MemoryStorage engine
  const storage = multer.memoryStorage();

  const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: filter });

  return upload;
};

exports.uploadSingleImage = (fileName) => multerOption().single(fileName);

exports.uploadMultipleImages = (arrayOfFields) => multerOption().fields(arrayOfFields);