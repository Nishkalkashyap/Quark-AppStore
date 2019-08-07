import ReactGA from 'react-ga';
export { ReactGA };

export function initializeReactGa() {
    ReactGA.initialize('UA-112064718-9');
}

const downloadsCount = (userId: string, projectId: string, assetName: string) => {
    ReactGA.event({
        category: 'DownloadCount',
        action: `${userId}/${projectId}`,
        label: assetName
    });
}

const pageview = (path: string) => {
    ReactGA.pageview(path);
}

export const analytics = {
    downloadsCount,
    pageview
}
