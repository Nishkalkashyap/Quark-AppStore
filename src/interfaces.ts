export interface ProjectData {
    projectId: string;//auto set

    projectName: string;
    tagline: string;
    description: string;
    numberOfReleases: number;
    createdAt: firebase.firestore.Timestamp//auto set
    updatedAt: firebase.firestore.Timestamp;//auto set

    category: allCategories;
    coverImageUrl?: string;
}

export type allCategories =
    'Books' |
    'Business' |
    'Catalogs' |
    'Developer Tools' |
    'Education' |
    'Entertainment' |
    'Finance' |
    'Food & Drink' |
    'Games' |
    'Health & Fitness' |
    'Graphics & Design' |
    'Lifestyle' |
    'Kids' |
    'Magazines & Newspapers' |
    'Medical' |
    'Music' |
    'Navigation' |
    'News' |
    'Photo & Video' |
    'Productivity' |
    'Reference' |
    'Shopping' |
    'Social Networking' |
    'Sports' |
    'Travel' |
    'Utilities'

export interface ProjectStats {
    numberOfDownloads: number;
    // numberOfViews: number;
}

export interface ProjectReviewInterface {
    rating: number;
    title: string;
    content: string;
}

export interface ReleaseItem {
    projectId: string;//auto set
    releaseId: string;//auto set

    notes: string;

    updatedAt: firebase.firestore.Timestamp;//auto set
    createdAt: firebase.firestore.Timestamp;//auto set
    assets: string[];
}

export interface MessageDialogInterface<T = any> {
    title: string;
    text: string;
    buttons: T[];
    isOpen: boolean;
    type: "info" | "error" | "question" | "warning"
}

export interface FormDialogInterface<T = any> {
    title: string;
    subTitle: string;
    value: string;
    buttons: T[];
    isOpen: boolean;
    fieldlabel: string;
}