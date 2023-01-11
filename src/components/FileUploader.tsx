import React from 'react';

interface Props {
    handleFileUpload: (file: File) => void
    targetResizeHeight?: number
}

const FileUploader = ({
    handleFileUpload, targetResizeHeight,
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
            if(!targetResizeHeight){
                console.log('No resize');
                handleFileUpload(uploadedFile);
                return;
            }
            const sourceImg = new Image();
            sourceImg.src = await fileToDataUri(uploadedFile) as string;
            sourceImg.onload = async () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d') as CanvasRenderingContext2D;

                const scaleFactor = targetResizeHeight / sourceImg.height;

                canvas.width = Math.round(sourceImg.width * scaleFactor);
                canvas.height = targetResizeHeight;
                context.drawImage(
                    sourceImg,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                canvas.toBlob(blob => {
                    if(!blob){
                        console.log('Blob creation failed');
                        return;
                    }
                    const targetImg = new File([ blob ], uploadedFile.name, { type: 'image/png' });
                    handleFileUpload(targetImg);
                }, 'image/png');
            };
        }
    };


    const fileToDataUri = async (file: File) => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });

    return (
        <>
            <button
                data-testid='fileuploader-button'
                onClick={handleClick}
            >
                Upload a file
            </button>
            <input
                type="file"
                accept="image/*"
                data-testid='fileuploader-field'
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    );
};
export default FileUploader;
