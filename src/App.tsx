import React, {
    useState, useEffect,
} from 'react';
import axios from 'axios';
import './App.css';
import {
    BrowserRouter, Routes, Route,
} from 'react-router-dom';
import FileUploader from './components/FileUploader';
import Menu from './components/Menu';
import Home from './pages/Home';
import Items from './pages/Items';


const DEBUG = true;
const API_URL = DEBUG ? 'http://127.0.0.1:5337' : 'http://127.0.0.1/server';

const REFRESH_TIMEOUT = 5;

interface Song {
    Id: number
    Name: string
    Path: string
}

interface Schedule {
    Id: number
    FileId: number
    Time: string
}

enum Page {
    Home,
    Files,
    Schedules,
    Settings,
}

enum Status {
    Init,
    Disconnected,
    Connected,
    Running,
    Idle,
    Paused,
}

function App() {
    const [
        activePage,
        setActivePage,
    ] = useState<Page>(Page.Home);

    const [
        status,
        setStatus,
    ] = useState<Status>(Status.Connected);

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
        if (DEBUG) {
            console.log(`refresh ${refreshTimeout}`);
        }
        if(refreshTimeout == 0){
            setRefreshTimeout(null);
            fetchData();
            return;
        }
        setTimeout(() => setRefreshTimeout(refreshTimeout - 1), 1000);
    }, [ refreshTimeout ]);

    const getFunction = (func: string) => {
        if (DEBUG) {
            console.log('getFunction');
        }
        axios
            .get(`${API_URL}/${func}`)
            .then(() => {
                setTimeout(fetchData);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchData = () => {
        if (DEBUG) {
            console.log('fetchData');
        }
        axios
            .get<Status | null>(`${API_URL}/get_status`)
            .then(res => {
                if(res.status) {
                    setStatus(res.status);
                }
            })
            .catch(err => {
                console.error(err);
                setRefreshTimeout(REFRESH_TIMEOUT);
            });
    };

    const uploadFile = (file: File) => {
        if (DEBUG) {
            console.log('uploadFile');
        }
        const formData = new FormData();
        formData.append('file', file);
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios
            .post(`${API_URL}/upload`, formData, { headers })
            .then(() => {
                fetchData();
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (DEBUG) {
            console.log('initial useEffect');
        }
        fetchData();
    }, []);

    return (
        <div>
            {status === Status.Disconnected &&
                <div>Disconnected</div>
            }
            {status !== Status.Disconnected &&
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={<Menu />}
                        >
                            <Route
                                index
                                element={<Home />}
                            />
                            <Route
                                path="items"
                                element={<Items />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            }
        </div>
    );
}

export default App;
