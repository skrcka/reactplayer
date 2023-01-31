import MediaTable from '../components/MediaTable';
import Consts from '../Consts';
import axios from 'axios';
import { MediaFile } from '../models/MediaFile';
import { useEffect } from 'react';


const Media = (props: {
    files: MediaFile[],
    fetchFiles: () => void,
}) => {
    const {
        files,
        fetchFiles,
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
        if (Consts.DEBUG) {
            console.log('onDelete');
        }
        axios
            .get(`${Consts.API_URL}/delete?id=${id}`)
            .then(() => {
                fetchFiles();
            });
    };

    const onPlay = (id: number) => {
        if (Consts.DEBUG) {
            console.log('onPlay');
        }
        axios.get(`${Consts.API_URL}/play?id=${id}`);
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
                onUpload={uploadFile}
            />
        </>
    );
};

export default Media;
