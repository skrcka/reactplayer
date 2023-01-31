import React, {
    useState, useEffect,
} from 'react';
import axios from 'axios';
import './App.css';
import {
    Routes, Route,
} from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import Media from './pages/Media';
import NoPage from './pages/NoPage';
import Consts from './Consts';
import {
    State, Status,
} from './models/State';
import { MediaFile } from './models/MediaFile';
import { Schedule } from './models/Schedule';
import Scheduler from './pages/Scheduler';


function App() {
    const [
        state,
        setState,
    ] = useState<State>(new State());

    const [
        refreshTimeout,
        setRefreshTimeout,
    ] = useState<number | null>(null);

    // Server not available
    useEffect(() => {
        // Exit if no refresh required
        if(refreshTimeout === null){
            return;
        }
        if (Consts.DEBUG) {
            console.log(`refresh ${refreshTimeout}`);
        }
        if(refreshTimeout == 0){
            setRefreshTimeout(null);
            fetchStatus();
            return;
        }
        setTimeout(() => setRefreshTimeout(refreshTimeout - 1), 1000);
    }, [ refreshTimeout ]);

    const updateFiles = (files: Array<MediaFile>) => {
        if (Consts.DEBUG) {
            console.log('updateFiles');
        }
        setState(prevState => ({
            status: prevState.status,
            files: files,
            schedules: prevState.schedules,
        }));
    };

    const updateSchedules = (schedules: Array<Schedule>) => {
        if (Consts.DEBUG) {
            console.log('updateSchedules');
            console.log(schedules);
        }
        setState(prevState => ({
            status: prevState.status,
            files: prevState.files,
            schedules: schedules,
        }));
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

    const fetchStatus = () => {
        if (Consts.DEBUG) {
            console.log('fetchData');
        }
        axios
            .get<Status | null>(`${Consts.API_URL}/status`)
            .then(res => {
                if(res.status) {
                    setState(prevState => ({
                        status: res.status,
                        files: prevState.files,
                        schedules: prevState.schedules,
                    }));
                }
            })
            .catch(err => {
                console.error(err);
                setRefreshTimeout(Consts.REFRESH_TIMEOUT);
            });
    };

    useEffect(() => {
        if (Consts.DEBUG) {
            console.log('initial useEffect');
        }
        fetchStatus();
    }, []);

    return (
        <div>
            {state.status === Status.Disconnected &&
                <div>Disconnected</div>
            }
            {state.status !== Status.Disconnected &&
            <>
                <Menu />
                <Routes>
                    <Route
                        path="/"
                        element={ <Home/> }
                    />
                    <Route
                        path="media"
                        element={
                            <Media
                                files={ state.files }
                                fetchFiles={fetchFiles}
                            />
                        }
                    />
                    <Route
                        path="schedules"
                        element={
                            <Scheduler
                                schedules={ state.schedules }
                                files={ state.files }
                                updateSchedules={updateSchedules}
                            />
                        }
                    />
                    <Route
                        path="*"
                        element={ <NoPage/> }
                    />
                </Routes>
            </>
            }
        </div>
    );
}

export default App;
