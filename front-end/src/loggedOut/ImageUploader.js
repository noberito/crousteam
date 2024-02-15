// ImageUploader.js

import axios from 'axios';

const uploadImage = async (filePath, login, baseUrl) => {
  try {
    const formData = new FormData();
    formData.append('imageInp', {
      uri: filePath.uri,
      type: filePath.type,
      name: filePath.fileName,
    });
    formData.append('login', login);

    const response = await axios.post(`${baseUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export default uploadImage;
