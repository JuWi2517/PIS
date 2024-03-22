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
  
function getOrderByIdProdej(container,id){
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
		
		
		orderUserName.innerHTML = orderData.userId;
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
function getOrderByIdNakup(container,id){

const orderUserName = document.getElementById('orderUser');
	const orderDate = document.getElementById('orderDate');
	const orderSum = document.getElementById('sumPrice');
	const orderState = document.getElementById('orderState');
	const orderItems = document.getElementById(container);
	
	const orderRef = database.ref('ordersMaterials/' + id);
	
	var row = addRowCells(orderItems,5);
	setCellText(row,0,"Název Položky");	
	setCellText(row,1,"Id položky");	
	setCellText(row,2,"Počet kusů");
	setCellText(row,3,"Cena za kus");	
	setCellText(row,4,"Celková cena za položku");
			
	var price = 0;
	orderRef.once('value').then(snapshot => {
		const orderData = snapshot.val();
		
		
		orderUserName.innerHTML = orderData.supplierID;
		orderDate.innerHTML = new Date(orderData.timestamp).toUTCString()
		
		
		for(let i = 0; i < orderData.items.length; i++) {
				let obj = orderData.items[i];
				const productRef = database.ref('materials/' + obj.productId);
				
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
	
	return productRef.once('value').then((snapshot) => {
		var price = snapshot.val().price;
	});
	
}	
function getAllOrdersByType(container){
	var type = orderUserName = document.getElementById('type').value;
	var table = document.getElementById(container);
	
	table.innerHTML = "";
	var row;
	if (type == "sup"){ // dodavatel
		row = addRowCells(table,4);

		setCellText(row,0,"Dodavatel");	
		setCellText(row,1,"Id objednávky");	
		setCellText(row,2,"Datum");
		setCellText(row,3,"Celková cena Objednávky");
	} else if(type == "sub"){ //zakaznici
		row = addRowCells(table,5);
 
		setCellText(row,0,"Zákazník");	
		setCellText(row,1,"Id objednávky");	
		setCellText(row,2,"Datum");
		setCellText(row,3,"Celková cena Objednávky");	
		setCellText(row,4,"Stav Platby");
	} else {
		row = addRowCells(table,6);
 
		setCellText(row,0,"Typ");	
		setCellText(row,1,"Zákazník / Dodavatel");	
		setCellText(row,2,"Id objednávky");	
		setCellText(row,3,"Datum");
		setCellText(row,4,"Celková cena Objednávky");	
		setCellText(row,5,"Stav Platby");
	}
	
	if (type == "sup") { // dodavatele
		database.ref('ordersMaterials').once('value')
		.then(snapshot => {
			snapshot.forEach(childSnapshot => {
					const supplierData = childSnapshot.val();				
				
					var row = addRowCells(table, 5);				
					var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
					var cellShow = '<a href="showObjednavkaNakup.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';
	
					setCellText(row, 0, supplierData.supplierID);
					setCellText(row, 1, childSnapshot.key);
	
					setCellText(row, 2, new Date(supplierData.timestamp).toUTCString());
					setCellText(row, 3, supplierData.items.length);	
					
					setCellText(row, 4, cellShow);
	
					
					var price = 0;
					for (let i = 0; i < supplierData.items.length; i++) {
						let obj = supplierData.items[i];
						var productRef = database.ref('materials/' + obj.productId);	
	
						productRef.once('value').then(snapshot => {
							var productData = snapshot.val();
							price += productData.price * obj.quantity;
							setCellText(row, 3, price);
						})
						.catch(error => {
							//console.error('order error:', error);
						});	
					}
					
				
			});
				   
		})
		.catch(error => {
			console.error('Error fetching products:', error);
		});
	} else if (type == "sub") { // zakaznik		
		database.ref('orders').once('value')
		.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();		
			
			var row = addRowCells(table, 7);			
			
			var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			var cellShow = '<a href="showObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';

				setCellText(row, 0, supplierData.userId);
				setCellText(row, 1, childSnapshot.key);

				setCellText(row, 2, new Date(supplierData.timestamp).toUTCString());
				setCellText(row, 3, "celková cena");

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
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
	} else { // all
		/*
		row = addRowCells(table,6);
 
		setCellText(row,0,"Typ");	
		setCellText(row,1,"Zákazník / Dodavatel");	
		setCellText(row,2,"Id objednávky");	
		setCellText(row,3,"Datum");
		setCellText(row,4,"Celková cena Objednávky");	
		setCellText(row,5,"Stav Platby");
		*/
		database.ref('orders').once('value')
		.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();		
			
			var row = addRowCells(table, 8);			
			
			var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			var cellShow = '<a href="showObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';

				setCellText(row, 0, "Prodej");
				setCellText(row, 1, supplierData.userId);
				setCellText(row, 2, childSnapshot.key);

				setCellText(row, 3, new Date(supplierData.timestamp).toUTCString());
				setCellText(row, 4, "celková cena");

				var price = 0;
				for (let i = 0; i < supplierData.items.length; i++) {
					let obj = supplierData.items[i];
					var productRef = database.ref('products/' + obj.productId);

					productRef.once('value').then(snapshot => {
						var productData = snapshot.val();
						price += productData.price * obj.quantity;
						setCellText(row, 4, price);
					})
					.catch(error => {
						//console.error('order error:', error);
					});
				}

				if (supplierData.paid == true) {
					setCellText(row, 5, "Zaplaceno");
				} else {
					setCellText(row, 5, "Čekání na platbu");
				}

				setCellText(row, 6, cellUpdate);
				setCellText(row, 7, cellShow);			
		});
	});	
	database.ref('ordersMaterials').once('value')
		.then(snapshot => {
			snapshot.forEach(childSnapshot => {
					const supplierData = childSnapshot.val();				
				
					var row = addRowCells(table, 8);				
					var cellUpdate = '<a href="editObjednavka.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
					var cellShow = '<a href="showObjednavkaNakup.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';
	
					setCellText(row, 0, "Nákup");
					setCellText(row, 1, supplierData.supplierID);
					setCellText(row, 2, childSnapshot.key);
	
					setCellText(row, 3, new Date(supplierData.timestamp).toUTCString());
					setCellText(row, 4, supplierData.items.length);
	
					setCellText(row, 5, "---");

					setCellText(row, 6, cellUpdate);
					setCellText(row, 7, cellShow);
	
					
					var price = 0;
					for (let i = 0; i < supplierData.items.length; i++) {
						let obj = supplierData.items[i];
						var productRef = database.ref('materials/' + obj.productId);	
	
						productRef.once('value').then(snapshot => {
							var productData = snapshot.val();
							price += productData.price * obj.quantity;
							setCellText(row, 4, price);
						})
						.catch(error => {
							//console.error('order error:', error);
						});	
					}
					
				
			});
				   
		})
		.catch(error => {
			console.error('Error fetching products:', error);
		});
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
  





  


