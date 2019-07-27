import { Firebase } from './providers/firebase-provider';
import { WithSnackbarProps } from 'notistack';
import { Location, History } from 'history';
export interface basePropType {
    firebase: Firebase;
    history: History;
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

