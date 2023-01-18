import MediaTable from '../components/MediaTable';
import Consts from '../Consts';
import FileUploader from '../components/FileUploader';
import axios from 'axios';
import { MediaFile } from '../models/MediaFile';
import { useEffect } from 'react';


const Media = (props: {
    files: MediaFile[],
    updateFiles: (files: MediaFile[]) => void,
}) => {
    const {
        files,
        updateFiles,
    } = props;
    console.log('Media');
    console.log(files);

    useEffect(() => {
        if (Consts.DEBUG) {
            console.log('useEffectMedia');
        }
        fetchFiles();
    }, []);

    const onDelete = (id: number) => {
        axios.get(`${Consts.API_URL}/delete/${id}`);
    };

    const onPlay = (id: number) => {
        axios.get(`${Consts.API_URL}/play/${id}`);
    };

    const fetchFiles = () => {
        if (Consts.DEBUG) {
            console.log('fetchFiles');
        }
        axios
            .get(`${Consts.API_URL}/files`)
            .then(res => {
                updateFiles(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const uploadFile = (file: File) => {
        if (Consts.DEBUG) {
            console.log('uploadFile');
        }
        const formData = new FormData();
        formData.append('file', file);
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios
            .post(`${Consts.API_URL}/upload`, formData, { headers })
            .then(() => {
                fetchFiles();
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <>
            <h1>Media</h1>
            <MediaTable
                rows={files}
                onDelete={onDelete}
                onPlay={onPlay}
            />
        </>
    );
};

export default Media;
