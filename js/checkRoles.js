firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.admin) {
          console.log('User is an admin');
          document.getElementById("admin").style.display = "block";
          
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
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.warehouse) {
          console.log('User is an warehouse worker');
          document.getElementById("admin").style.display = "block";
          
        } else {
          console.log('User is not an warehouse worker');
        }
      })
      .catch((error) => {
        console.error('Error fetching ID token:', error);
      });
  } else {
    
    console.log('No user is signed in');
  }
});