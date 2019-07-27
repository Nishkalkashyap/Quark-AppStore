export interface ProjectData {
    projectId: string;//auto set

    projectName: string;
    description: string;
    numberOfReleases : number;
    createdAt: firebase.firestore.Timestamp//auto set
    updatedAt: firebase.firestore.Timestamp;//auto set
}

export interface ReleaseItem {
    projectId: string;//auto set
    releaseId: string;//auto set

    notes : string;

    updatedAt: firebase.firestore.Timestamp;//auto set
    createdAt: firebase.firestore.Timestamp;//auto set
    assets : string[];
}

export interface DialogInterface {
    title: string;
    text: string;
    actions: { text: string, handle: Function }[];
    isOpen: boolean; handleClose: Function;
}