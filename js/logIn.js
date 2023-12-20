const firebaseConfig = {
    apiKey: "AIzaSyAUI9U-zSLCS-MfqF4_lYo6abwWSKuoa2s",
    authDomain: "projectinfosystem-c7a40.firebaseapp.com",
    projectId: "projectinfosystem-c7a40",
    storageBucket: "projectinfosystem-c7a40.appspot.com",
    messagingSenderId: "141548851105",
    appId: "1:141548851105:web:6b154365af8a97b75b05e0",
    measurementId: "G-4YZFYKRD9Z",
    databaseURL: "https://projectinfosystem-c7a40-default-rtdb.europe-west1.firebasedatabase.app/",
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); 
  } else {
    firebase.app(); // if already initialized, use that one
  }
  
  const auth = firebase.auth();
  const database = firebase.database();
  
  
  function isValidEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(email);
  }
  
  
  function handleSignUp(event) {
        event.preventDefault();
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
  
      if (!isValidEmail(email)) {
          console.error('Invalid email format');
          return;
      }
  
      signUp(email, password);
  }
  
 
  function handleLogin(event) {
    event.preventDefault();
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
  
      login(email, password);
  }
  
  
  const signUp = (email, password) => {
      auth.createUserWithEmailAndPassword(email, password)  
          .then((userCredential) => {
              const user = userCredential.user;
              database.ref('users/' + user.uid).set({
                  email: email,
                  uid: user.uid
              });
            alert("Registrace se zdařila")
          })
          .catch((error) => {
              alert('Účet už byl zaregistrován')
          });
  };
  
  
  const login = (email, password) => {
      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              console.log('User logged in:', userCredential.user.uid);
          })
          .catch((error) => {
              console.error('Login error:', error);
          });
  }; 
        
