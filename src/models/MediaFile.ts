class MediaFile {
    id: number;
    name: string;
    path: string;

    constructor(id: number, name: string, path: string){
        this.id = id;
        this.name = name;
        this.path = path;
    }
}

export {
    MediaFile,
};
