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
 
function createOrder() {
	const supplierName = document.getElementById('sName').value;
	const supplierPerson = document.getElementById('sPerson').value;
	const supplierEmail = document.getElementById('sEmail').value;
	const supplierPhone = document.getElementById('sPhone').value;
	const supplierAdress = document.getElementById('sAddress').value;
	const supplierBankAcount = document.getElementById('sBankAccount').value;

	const newSupplierRef = database.ref('suppliers').push();
	newSupplierRef.set({  
		name: supplierName,
		person: supplierPerson,
		email: supplierEmail,
		phone: supplierPhone,
		adress: supplierAdress,
		bank_account: supplierBankAcount
	});
	window.location.href = "dodavatele.html";
	
}
function updateOrder(id,data){
	  
	const supplierName = document.getElementById('sName').value;
	const supplierPerson = document.getElementById('sPerson').value;
	const supplierEmail = document.getElementById('sEmail').value;
	const supplierPhone = document.getElementById('sPhone').value;
	const supplierAdress = document.getElementById('sAddress').value;
	const supplierBankAcount = document.getElementById('sBankAccount').value;
	var idSupplierHid = document.getElementById('idSupplier');	
	id = idSupplierHid.value;
	
	const newSupplierRef = database.ref('suppliers/' + id);
		newSupplierRef.set({  		
			name: supplierName,
			person: supplierPerson,
			email: supplierEmail,
			phone: supplierPhone,
			adress: supplierAdress,
			bank_account: supplierBankAcount
		});
	window.location.href = "dodavatele.html";
}
function deleteOrder(productId) {
	const productRef = database.ref('suppliers/' + productId);
	productRef.remove();
	location.reload("dodavatele.html");
}
  
function getOrderById(container,id){
	const orderUserName = document.getElementById('orderUser');
	const orderDate = document.getElementById('orderDate');
	const orderSum = document.getElementById('sumPrice');
	const orderState = document.getElementById('orderState');
	const orderItems = document.getElementById(container);
	
	const orderRef = database.ref('orders/' + id);
	
	var row = addRowCells(orderItems,5);
	setCellText(row,0,"Název Položky");	
	setCellText(row,1,"Id položky");	
	setCellText(row,2,"Počet kusů");
	setCellText(row,3,"Cena za kus");	
	setCellText(row,4,"Celková cena za položku");
			
	var price = 0;
	orderRef.once('value').then(snapshot => {
		const orderData = snapshot.val();
		
		
		orderUserName.innerHTML = "Uživatel";
		orderDate.innerHTML = new Date(orderData.timestamp).toUTCString()
		orderState.value = orderData.paid;
		
		for(let i = 0; i < orderData.items.length; i++) {
				let obj = orderData.items[i];
				const productRef = database.ref('products/' + obj.productId);
				
				//var row = addRowCells(orderItems,5);
				productRef.once('value').then(snapshot => {
					const productData = snapshot.val();
					var itemPrice = productData.price * obj.quantity;
					price += itemPrice;
					//console.log(price);
					var row = addRowCells(orderItems,5);
					
					setCellText(row,0,productData.name);	
					setCellText(row,1,snapshot.key);	
					setCellText(row,2,obj.quantity);
					setCellText(row,3,productData.price);	
					setCellText(row,4,itemPrice);
					
					orderSum.innerHTML = price;
				})
				
				
			}
		
					
	})
	
}
function getAllOrders(container){
	const products = new Array();
	var table = document.getElementById(container);
	table.innerHTML = "";
	var row = addRowCells(table,6);
 
	setCellText(row,0,"Uživatel");	
	setCellText(row,1,"Id objednávky");	
	setCellText(row,2,"Datum");
	setCellText(row,3,"Celková cena Objednávky");	
	setCellText(row,4,"Stav Platby");	
	 
	database.ref('orders').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();          
		    
			var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			var cellShow= '<a href="showObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';
			
			var row = addRowCells(table,7); 
			setCellText(row,0,"Uživatel");	
			setCellText(row,1,childSnapshot.key);
			setCellText(row,2,new Date(supplierData.timestamp).toUTCString());
			
			setCellText(row,3,supplierData.items.length);			
			
			var price = 0;
			for(let i = 0; i < supplierData.items.length; i++) {
				let obj = supplierData.items[i];
				var productRef = database.ref('products/' + obj.productId);
				
				
				productRef.once('value').then(snapshot => {
					var productData = snapshot.val();
					price += productData.price * obj.quantity;
					setCellText(row,3,price);
				})
				.catch(error => {
					//console.error('order error:', error);
				}); 
				
				
			}
			
			
			if(supplierData.paid == true){
				setCellText(row,4,"Zaplaceno");
			} else {
				setCellText(row,4,"Čekání na platbu");
			}
					
			setCellText(row,5,cellUpdate);
			setCellText(row,6,cellShow);			
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;

}
function getPriceAll(products){
	
	const productRef = database.ref('products/' + products[0].productId);
	/*
	productRef.once('value')
	.then(snapshot => {
		const productData = snapshot.val();
		return snapshot.val().price;
	});
	*/
	return productRef.once('value').then((snapshot) => {
		var price = snapshot.val().price;
	});
	
	//const dbRef = database.ref().child("products").child(products[0].productId).get();

	
	//const dbRef = database.ref().dbRef.child("products").child(products[0].productId).get();
	
	//productRef
	//console.log(dbRef);
}	
function getAllOrdersByType(container){
	var type = orderUserName = document.getElementById('type');
	var table = document.getElementById(container);
	
	table.innerHTML = "";
	var row = addRowCells(table,6);
 
	setCellText(row,0,"Uživatel");	
	setCellText(row,1,"Id objednávky");	
	setCellText(row,2,"Datum");
	setCellText(row,3,"Celková cena Objednávky");	
	setCellText(row,4,"Stav Platby");
	
	var show = false;
	database.ref('orders').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();
			var show = false;
			if (type == "all") {
				show = true;

			} else if (type == "sup" && supplierData.supId == "") {
				show = true;
			} else if (type == "sub" && supplierData.supId == "") {
				show = true;
			} else {
				show = false;
			}

			if (show) {
				var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
				var cellShow = '<a href="showObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';

				var row = addRowCells(table, 7);
				setCellText(row, 0, "Uživatel");

				setCellText(row, 1, childSnapshot.key);
				setCellText(row, 2, new Date(supplierData.timestamp).toUTCString());

				setCellText(row, 3, supplierData.items.length);

				var price = 0;
				for (let i = 0; i < supplierData.items.length; i++) {
					let obj = supplierData.items[i];
					var productRef = database.ref('products/' + obj.productId);


					productRef.once('value').then(snapshot => {
						var productData = snapshot.val();
						price += productData.price * obj.quantity;
						setCellText(row, 3, price);
					})
						.catch(error => {
							//console.error('order error:', error);
						});


				}


				if (supplierData.paid == true) {
					setCellText(row, 4, "Zaplaceno");
				} else {
					setCellText(row, 4, "Čekání na platbu");
				}

				setCellText(row, 5, cellUpdate);
				setCellText(row, 6, cellShow);
			}
			show = false;
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
	
	
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
  





  

