import { MediaFile } from './MediaFile';
import { Schedule } from './Schedule';


enum Status {
    Init,
    Disconnected,
    Connected,
    Running,
    Idle,
    Paused,
}

class State {
    files: MediaFile[];
    schedules: Schedule[];
    status: Status;

    constructor() {
        this.files = [];
        this.schedules = [];
        this.status = Status.Disconnected;
    }
}

export {
    State,
    Status,
};
