async function downloadFile(url: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
    } catch (message) {
        return console.error(message);
    }
}

export default downloadFile;