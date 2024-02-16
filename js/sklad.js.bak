if (!firebase.apps.length) {
	var firebaseConfig = {
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
} else {
	firebase.app(); // if already initialized, use that one
}
  
const database = firebase.database();
const storage = firebase.storage().ref();

function fetchProducts(id){
	const products = new Array();
	var table = document.getElementById(id);
	var selectList = document.getElementById("skladInsertSelect");
	var removeSelectList = document.getElementById("skladRemoveSelect");
	table.innerHTML = "";
	var totalPrice = 0;
	var totalP1 = document.getElementById("totalP");
    		  
	var row = addRowCells(table,7); 
	setCellText(row,0,"Obrázek");	
	setCellText(row,1,"Název");	
	setCellText(row,2,"Popis");	
	setCellText(row,3,"Kusů zboží");
	setCellText(row,4,"Cena za kus");
	setCellText(row,5,"Cena za zboží celkem");	
    
	database.ref('products').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const productData = childSnapshot.val();
          
			var cellOBR = '<img src="' + productData.imageURL + '" style="width:100px;height:100px;">' ;
			
			var totalPriceProduct = productData.price * productData.stockCount;
			
			var cellRemove = '<input class="btn btn-danger"type="submit" value="Smazat">';
			var cellEdit = '<a href="#" class="btn btn-primary">Editovat</a>';
			
			var row = addRowCells(table,8); 
			setCellText(row,0,cellOBR);	
			setCellText(row,1,productData.name);	
			setCellText(row,2,productData.description);	
			setCellText(row,3,productData.stockCount);
			setCellText(row,4,productData.price + " Kč");
			setCellText(row,5,totalPriceProduct + " Kč");
			setCellText(row,6,cellEdit);
			setCellText(row,7,cellRemove);				

			totalPrice += totalPriceProduct;
			    
		});
		var row = addRowCells(table,8); 
		setCellText(row,5,totalPrice + " Kč");		
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;
}
function addPocetSklad() {
	var productId = document.getElementById("skladInsertSelect").value;
	var newCount = parseInt(document.getElementById("addCountProduct").value); 
  
	if (!isNaN(newCount) && newCount >= 0) {
		var productRef = database.ref('products/' + productId);
		productRef.transaction((product) => {
			if (product) {
				product.stockCount += newCount; 
				location.reload("sklad.html");
			} 
			return product;
		}, (error, committed, snapshot) => {
			if (error) {
				console.error('Transaction failed abnormally!', error);
			} else if (!committed) {
				console.error('We aborted the transaction (because product does not exist).');
			} else {
				console.log('Stock count updated!');
			}
			console.log("Snapshot of data: ", snapshot.val());
		});
	} else {
		console.error("Invalid count value");     
	}  
}
function removePocetSklad() {
	var productId = document.getElementById("skladRemoveSelect").value;
	var newCount = parseInt(document.getElementById("removeCountProduct").value);
  
	if (!isNaN(newCount) && newCount > 0) {       
		var productRef = database.ref('products/' + productId); 

		productRef.transaction((product) => {
			if (product) {
				if(product.stockCount > 0){
					product.stockCount -= newCount; 
					location.reload("sklad.html")   
				}
			}
			return product; 
		}, (error, committed, snapshot) => {
			if (error) {
				console.error('Transaction failed abnormally!', error);
			} else if (!committed) {
				console.error('We aborted the transaction (because product does not exist).');
			} else {
				console.log('Stock count updated!');
			}
			console.log("Snapshot of data: ", snapshot.val());
		});
	} else {
		console.error("Invalid count value");      
	} 
}
function addRowCells(table,count){
	var row = table.insertRow();
	for (let i = 0; i < count; i++) {
		row.insertCell(i);
	}
	return row;
}	
function setCellText(row,indexCell,txt){
	row.cells[indexCell].innerHTML = txt;	
}




