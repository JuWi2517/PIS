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
  
firebase.initializeApp(firebaseConfig);
  
const database = firebase.database();
const storage = firebase.storage().ref();

function fetchProducts(id){
    console.log("fetch");
    const products = new Array();
    var table = document.getElementById(id);
    var selectList = document.getElementById("skladInsertSelect");
    
    var i = 0; 
    
    database.ref('products').once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
          const productData = childSnapshot.val();
          
          var row = table.insertRow();
          
          var cellOBR = row.insertCell(0);
          var cellNazev = row.insertCell(1);
          var cellPopis = row.insertCell(2);
          var cellPocetKusu = row.insertCell(3);

          cellOBR.innerHTML = '<img src="' + productData.imageURL + '" style="width:100px;height:100px;">' ;
          cellNazev.innerHTML = productData.name;
          cellPopis.innerHTML = productData.description;
          cellPocetKusu.innerHTML = 0;
          
          products.push(productData);
          selectList.innerHTML += '<option value="' + i + '">' + productData.name + '</option>';
       
          ++i;
       });
    })
    .catch(error => {
      //console.error('Error fetching products:', error);
    });
    
      
    return products;
}
function addPocetSklad(){
     var id = document.getElementById("skladInsertSelect").value;
     var count = document.getElementById("addCountProduct").value;
     
     console.log(id + " count: " + count);
     
     
}




document.getElementById('productForm').addEventListener('submit', addProduct);
