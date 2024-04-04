const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dyqiqaggn",
  api_key: process.env.CLOUD_API_KEY || 224385891397362,
  api_secret: process.env.CLOUD_API_SECRET || "cqIqGtpZgq-9TsVyWm5FI7A8xcc",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Blog",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
