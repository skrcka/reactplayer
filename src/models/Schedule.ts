enum Activity {
    Active,
    Inactive,
}

class Schedule {
    id: number;
    file_id: number;
    schedule: string;
    activity: Activity;

    constructor(id: number, file_id: number, schedule: string, activity: Activity){
        this.id = id;
        this.file_id = file_id;
        this.schedule = schedule;
        this.activity = activity;
    }
}

export {
    Schedule,
};
