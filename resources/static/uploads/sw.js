self.addEventListener('push', event => {
    debugger
    const data = event.data.json();
    console.log('Push received:', data);
    window.localStorage.setItem('notification', JSON.stringify(data));
    // self.registration.showNotification(data.title, {
    //     body: 'Yay it works!',
    // });
});