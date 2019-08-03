export interface ProjectData {
    projectId: string;//auto set
    userId: string;//auto set

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
    'Utilities' |

    'Tutorial' |
    'Example'
    ;

export interface ProjectStats {
    numberOfDownloads?: number;
    numberOfReviews?: number;
    totalScore?: number;
    averageRating?: number;
    numberOfStars_1?: number;
    numberOfStars_2?: number;
    numberOfStars_3?: number;
    numberOfStars_4?: number;
    numberOfStars_5?: number;
}

export interface ProjectReviewInterface {
    rating: number;
    title: string;
    content: string;
    userId: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
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

export interface UserProfileInterface {
    name?: string,
    bio?: string,
    location?: string,
    site?: string
}

export interface GenericFormData {
    data: {
        [key: string]: ({
            formData?: {
                label: string;
                type: "text" | "password";
                value: string;
                required: boolean;
                autoComplete?: string;
                multiline?: boolean
                rows?: string;
            }
            component?: JSX.Element
        }),
    }
    onSubmit: Function;
    onChange: Function;
    isInvalid: boolean;
    icon: any;
    submitButtonText: string;
    headingText: string;
}
