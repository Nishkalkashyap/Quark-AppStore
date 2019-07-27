export function getProfilePath(currentUser: firebase.User) {
    return `Users/${currentUser.uid}/profile/userData`
}

export function getProjectPath(userId: string, projectId: string) {
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

// export function getStorageBucketReleaseUrl(userId: string, projectId: string, releaseId: string) {
//     return `User/${userId}/projects/${projectId}/releases/${releaseId}`;
// }