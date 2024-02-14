// ImageUploader.js

import axios from 'axios';

const uploadImage = async (filePath, username, authToken, baseUrl) => {
  try {
    const formData = new FormData();
    formData.append('imageInp', {
      uri: filePath.uri,
      type: filePath.type,
      name: filePath.fileName,
    });
    formData.append('login', username);

    const response = await axios.post(`${baseUrl}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
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
