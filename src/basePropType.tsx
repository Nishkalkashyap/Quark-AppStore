import { Firebase } from './providers/firebase-provider';
import { WithSnackbarProps } from 'notistack';
import { Location, History } from 'history';
export interface basePropType {
    firebase: Firebase;
    history: History;
    enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'];
    match: Match
    location: Location
    classes?: Record<string, string>
}

interface Match {
    isExact: boolean;
    params: {
        [key: string]: string;
    };
    path: string;
    url: string;
}

