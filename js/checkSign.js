firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      console.log('User is signed in:', user);
      // You can also redirect to a different page if necessary
    } else {
      // No user is signed in
      console.log('No user is signed in');
      // Redirect to the login page or handle accordingly
      window.location.href = 'login.html';
    }
});