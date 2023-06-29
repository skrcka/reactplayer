import SkrckaTable from '../components/SkrckaTable';
import ObjectTable from '../components/ObjectTable';
import Consts from '../Consts';
import axios from 'axios';
import { Schedule } from '../models/Schedule';
import { useEffect } from 'react';
import { MediaFile } from '../models/MediaFile';


const Scheduler = (props: {
    schedules: Array<Schedule>,
    files: Array<MediaFile>,
    updateSchedules: (schedules: Schedule[]) => void,
}) => {
    const {
        schedules,
        files,
        updateSchedules,
    } = props;
    console.log('Scheduler');
    console.log(schedules);

    useEffect(() => {
        if (Consts.DEBUG) {
            console.log('useEffectScheduler');
        }
        fetchSchedules();
    }, []);

    const onRemove = (id: number) => {
        if (Consts.DEBUG) {
            console.log('onRemove');
        }
        axios
            .get(`${Consts.API_URL}/remmove?id=${id}`)
            .then(() => {
                fetchSchedules();
            });
    };

    const onEdit = (id: number, file_id: number, schedule: string) => {
        if (Consts.DEBUG) {
            console.log('onEdit');
        }
        axios
            .post(`${Consts.API_URL}/reschedule`, {
                id: id,
                file_id: file_id,
                schedule: schedule,
            })
            .then(() => {
                fetchSchedules();
            });
    };

    const onSetActive = (id: number, active: boolean) => {
        if (Consts.DEBUG) {
            console.log('onSetActive');
        }
        axios
            .get(`${Consts.API_URL}/${active ? 'activate' : 'deactivate'}?id=${id}`)
            .then(() => {
                fetchSchedules();
            });
    };

    const fetchSchedules = () => {
        if (Consts.DEBUG) {
            console.log('fetchSchedules');
        }
        axios
            .get(`${Consts.API_URL}/schedules`)
            .then(res => {
                updateSchedules(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const uploadSchedule = (file_id: number, schedule: string) => {
        if (Consts.DEBUG) {
            console.log('uploadSchedule');
        }
        axios
            .post(`${Consts.API_URL}/schedule`, {
                file_id: file_id,
                schedule: schedule,
            })
            .then(() => {
                fetchSchedules();
            });
    };

    return (
        <ObjectTable
            rows={schedules}
            // files={files}
            // onRemove={onRemove}
            expandable={true}
            onSelect={onSetActive}
            onDelete={onRemove}
            onEdit={onEdit}
            // onSetActive={onSetActive}
            // onUpload={uploadSchedule}
        />
    );
};

export default Scheduler;
