(async function () {
    let uuid = '';

    // Check if UUID exists in local storage
    if (localStorage.getItem('uuid')) {
        uuid = localStorage.getItem('uuid');
        console.log('UUID found in local storage:', uuid);
    }

    // If UUID is still empty, generate a new one
    if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem('uuid', uuid);
        console.log('No UUID exists. New UUID generated:', uuid);
    }
})();

function generateUUID() {
    // Generate a UUID (Universally Unique Identifier)
    // Implementation of RFC4122 version 4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}