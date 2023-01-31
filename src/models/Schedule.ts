enum Activity {
    Active,
    Inactive,
}

interface Schedule {
    id: number;
    name: string;
    file_id: number;
    schedule: string;
    activity: Activity;
}

export type {
    Schedule,
    Activity,
};
