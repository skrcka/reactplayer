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
import Items from './pages/Media';
import NoPage from './pages/NoPage';
import Consts from './Consts';
import {
    State, Status,
} from './models/State';
import { MediaFile } from './models/MediaFile';


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

    const updateFiles = (files: MediaFile[]) => {
        if (Consts.DEBUG) {
            console.log('updateFiles');
        }
        setState(prevState => ({
            status: prevState.status,
            files: files,
            schedules: prevState.schedules,
        }));
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
                        path="items"
                        element={
                            <Items
                                files={ state.files }
                                updateFiles={updateFiles}
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
