export function getDocument_userData(currentUserID: string) {
    return `Users/${currentUserID}/profile/userData`
}

export function getDocument_metaData(currentUserID: string) {
    return `Users/${currentUserID}/profile/metaData`
}

export function getDocument_project(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}`
}

export function getCollection_projects(userId: string) {
    return `Users/${userId}/projects`
}

export function getCollection_releases(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/releases`;
}

export function getDocument_release(userId: string, projectId: string, releaseId: string) {
    return `Users/${userId}/projects/${projectId}/releases/${releaseId}`;
}

export function getDocument_stats(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/metaData/stats`;
}

export function getStorageRef_images(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/images`;
}

export function getCollection_reviews(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}/reviews`;
}

export function getDocument_review(userId: string, projectId: string, reviewerId : string) {
    return `Users/${userId}/projects/${projectId}/reviews/${reviewerId}`;
}


// export function getStorageBucketReleaseUrl(userId: string, projectId: string, releaseId: string) {
//     return `User/${userId}/projects/${projectId}/releases/${releaseId}`;
// }