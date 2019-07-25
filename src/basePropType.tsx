import { Firebase } from './services/firebase/firebase.index';
import { WithSnackbarProps } from 'notistack';
export interface basePropType {
    firebase: Firebase;
    history: {
        push: (path: string) => void;
    };
    enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'];
    match: Match
}

interface Match {
    isExact: boolean;
    params: {
        [key: string]: string;
    };
    path: string;
    url: string;
}