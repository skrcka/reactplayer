import React from 'react';

interface Props {
    handleFileUpload: (file: File) => void
}

const FileUploader = ({
    handleFileUpload,
}: Props) => {
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if(hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            const uploadedFile = event.target.files[0];
            handleFileUpload(uploadedFile);
        }
    };

    return (
        <>
            <button
                data-testid='fileuploader-button'
                className='btn btn-primary w-100 h-100'
                onClick={handleClick}
            >
                Upload File
            </button>
            <input
                type="file"
                accept="audio/*"
                data-testid='fileuploader-field'
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default FileUploader;
