export interface ProjectData {
    projectName: string;
    description: string;
    projectId: string;//auto set
    createdAt: firebase.firestore.Timestamp//auto set
}

export interface ReleaseItem {
    createdAt: firebase.firestore.Timestamp;//auto set
    updatedAt: firebase.firestore.Timestamp;//auto set
    releaseId: string;//auto set
    projectId: string;//auto set
    notes : string;
}