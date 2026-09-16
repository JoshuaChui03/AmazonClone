export function showGuestSessionStartedAlert(sessionDurationMinutes) {
    alert(
        `A temporary guest session has started. ` +
        `You have ${sessionDurationMinutes} minutes to use the store before your cart and orders reset.`
    );
}

export function showGuestSessionExpiredAlert(sessionDurationMinutes) {
    alert(
        `Your ${sessionDurationMinutes}-minute guest session has expired. ` +
        'Your previous cart and orders are no longer available. ' +
        'You will be returned to the sign-in page.'
    );
}

export function showUserSessionExpiredAlert() {
    alert('Your user session has expired. Please sign in again.');
}