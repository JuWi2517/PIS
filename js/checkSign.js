firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      
      console.log('User is signed in:', user);
     
    } else {
      
      console.log('No user is signed in');
      
      window.location.href = 'login.html';
    }
});
