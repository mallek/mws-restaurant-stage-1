// Adding in offline UX
// https://medium.com/@argo49/how-to-add-an-offline-notification-to-your-pwa-c11ee640822b
window.addEventListener("load", () => {
    function handleNetworkChange(event) {
        if (navigator.onLine) {
            document.body.classList.remove("offline");
        } else {
            document.body.classList.add("offline");
        }
    }
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
});