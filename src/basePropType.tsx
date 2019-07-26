import { Firebase } from './providers/firebase-provider';
import { WithSnackbarProps } from 'notistack';
import { Location } from 'history';
export interface basePropType {
    firebase: Firebase;
    history: {
        push: (path: string) => void;
    };
    enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'];
    match: Match
    location: Location
}

interface Match {
    isExact: boolean;
    params: {
        [key: string]: string;
    };
    path: string;
    url: string;
}

