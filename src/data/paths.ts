export function getProfilePath(currentUser: firebase.User) {
    return `Users/${currentUser.uid}/profile/userData`
}

export function getProjectPath(userId: string, projectId: string) {
    return `Users/${userId}/projects/${projectId}`
}