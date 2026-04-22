const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

class FileStorageService {
  storeFile(file) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const uniqueFileName = `${uuidv4()}-${file.originalname}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      fs.writeFileSync(filePath, file.buffer);

      return {
        fileName: uniqueFileName,
        fileUrl: `/uploads/${uniqueFileName}`,
        fileType: file.mimetype
      };
    } catch (error) {
      throw error;
    }
  }

  getFile(fileName) {
    try {
      const filePath = path.join(uploadsDir, fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      return filePath;
    } catch (error) {
      throw error;
    }
  }

  deleteFile(fileName) {
    try {
      const filePath = path.join(uploadsDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FileStorageService();
