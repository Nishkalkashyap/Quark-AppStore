import { basePropType } from "./components/login/signup";

export function handleFirebaseError(props: basePropType, err: any, message: string) {
    console.error(err, err.message);
    if (message) {
        props.enqueueSnackbar(message, { variant: 'error' });
    }
    if (err.message && typeof err.message == 'string') {
        props.enqueueSnackbar(err.message, { variant: 'error' });
    }
}

export function getRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
}