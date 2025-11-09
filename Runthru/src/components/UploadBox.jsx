import React, { useRef, useState } from 'react';

const UploadBox = ({ onFileUpload, disabled }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (['cpp', 'py'].includes(fileExtension)) {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert('Please upload a .cpp or .py file.');
        setFileName('');
        fileInputRef.current.value = ''; // Clear the input
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".cpp,.py"
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Analyzing...' : 'Upload File'}
      </button>
      {fileName && <span className="text-gray-600 dark:text-gray-300 text-sm">{fileName}</span>}
    </div>
  );
};

export default UploadBox;
