export function getProfilePath(currentUser: firebase.User) {
    return `Users/${currentUser.uid}/profile/userData`
}

export function getProjectDocPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}`
}

export function getProjectsCollectionPath(userId: string) {
    return `Users/${userId}/projects`
}

export function getReleaseListCollectionPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/releases`;
}

export function getProjectReleaseDocPath(userId: string, projectId: string, releaseId: string) {
    return `Users/${userId}/projects/${projectId}/releases/${releaseId}`;
}

export function getProjectStatsDocPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/metaData/stats`;
}

export function getProjectStorageImagesPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/images`;
}

export function getProjectReviewsDocPath(userId: string, projectId: string, currentUserId: string) {
    return `Users/${userId}/projects/${projectId}/reviews/${currentUserId}`;
}

export function getProjectReviewsCollectionPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/reviews`;
}


// export function getStorageBucketReleaseUrl(userId: string, projectId: string, releaseId: string) {
//     return `User/${userId}/projects/${projectId}/releases/${releaseId}`;
// }