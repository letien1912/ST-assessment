import { FC, useState } from 'react';
import { apiClient } from '../../shared/api-clients';

const Upload: FC<{ setUploading: (value: boolean) => void }> = ({
  setUploading,
}) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      await apiClient.post.uploadFile(file);
    } catch (e) {
      setErrorMessage(e?.response?.data?.message || 'Error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-4 bg-gray-100">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleUpload}
          className={`mt-2 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none`}
        >
          Upload
        </button>
      </div>

      {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default Upload;
