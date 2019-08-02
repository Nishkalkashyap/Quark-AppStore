import { basePropType } from "./basePropType";
import { useState } from "react";
import download from 'downloadjs';
import { StandardProperties } from "csstype";
import { allCategories, ProjectData, ReleaseItem } from "./interfaces";
import { getProjectReleaseDocPath, getProjectStatsDocPath } from "./data/paths";
import firebase from "firebase";


export const PRIMARY_COLOR = '#1f2631';
export const PRIMARY_COLOR_LIGHT = '#1f2631';
export const SECONDARY_COLOR = '#488aff';
export const ON_PRIMARY_COLOR = '#ffffff';
// export const PRIMARY_COLOR = '#6f5cfc';
// export const SECONDARY_COLOR = '#1f2631';
// export const PRIMARY_COLOR_LIGHT = '#8d9ef7';
// export const ON_PRIMARY_COLOR = '#ffffff';

export function handleFirebaseError(props: basePropType, err: any, message: string) {
    if (message) {
        props.enqueueSnackbar(message, { variant: 'error' });
    }
    if (err.message && typeof err.message == 'string') {
        props.enqueueSnackbar(err.message, { variant: 'error' });
    }
    console.error(err);
}

export function getRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
}

export function scrollToTop(behavior: "auto" | "smooth" | undefined = 'smooth') {
    // document.getElementById('routes-container')!.scrollTo({ top: 0, behavior })
    window.scrollTo({ top: 0, behavior })
}

export function useForceUpdate() {
    const [value, set] = useState(true); //boolean state
    return () => set(!value); // toggle the state to force render
}

export async function downloadFile(url: string, fileName: string) {
    const resp = await fetch(url, {
        method: 'GET',
    });
    const blob = await resp.blob();
    return download(blob, fileName);
}

export const GradientBackground: StandardProperties = {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
}

export const allProjectCategories: allCategories[] = [
    'Books',
    'Business',
    'Catalogs',
    'Developer Tools',
    'Education',
    'Entertainment',
    'Finance',
    'Food & Drink',
    'Games',
    'Health & Fitness',
    'Graphics & Design',
    'Lifestyle',
    'Kids',
    'Magazines & Newspapers',
    'Medical',
    'Music',
    'Navigation',
    'News',
    'Photo & Video',
    'Productivity',
    'Reference',
    'Shopping',
    'Social Networking',
    'Sports',
    'Travel',
    'Utilities',
    
    'Tutorial',
    'Example'
]

export function downloadReleaseItem(props: basePropType & { release: ReleaseItem; filename: string }) {
    const { filename, isOwner } = props;
    const releaseId = props.release.releaseId;
    props.firebase.storage.ref(`${getProjectReleaseDocPath(props.urlUserId!, props.urlProjectId!, releaseId)}/${filename}`).getDownloadURL()
        .then((val) => {
            // return downloadFile(val, filename);
            window.open(val);
        })
        .then(() => {
            if (!isOwner) {
                return props.firebase.firestore.doc(getProjectStatsDocPath(props.urlUserId!, props.urlProjectId!)).set(({
                    numberOfDownloads: firebase.firestore.FieldValue.increment(1) as any
                } as Partial<ProjectData>), { merge: true });
            }
        })
        .catch(err => handleFirebaseError(err, props, 'Failed to fetch download url'));
}