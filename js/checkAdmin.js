firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, now check for admin claim
    user.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
          console.log('User is an admin');
          // Perform admin-related tasks
        } else {
          console.log('User is not an admin');
        }
      })
      .catch((error) => {
        console.error('Error fetching ID token:', error);
      });
  } else {
    
    console.log('No user is signed in');
  }
});