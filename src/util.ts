import { basePropType } from "./basePropType";
import { useState } from "react";
import download from 'downloadjs';
import { StandardProperties } from "csstype";

export function handleFirebaseError(props: basePropType, err: any, message: string) {
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
    console.log(blob);
    download(blob, fileName);


    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = function (event) {
    //     var blob = xhr.response;
    //     console.log(blob);
    // };

    // xhr.open('GET', url);
    // xhr.send();
}

export const GradientBackground : StandardProperties = {
    background : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', boxShadow : '0 3px 5px 2px rgba(33, 203, 243, .3)'
}