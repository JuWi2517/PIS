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
 
function getCashFlow(from, to) {
	var prodejZisk = document.getElementById("prodejZisk");
	var celkemZisk = document.getElementById("celkemZisk");
	var nakladyMaterial = document.getElementById("nakladMaterial");
	var nakladyMzdy = document.getElementById("nakladMzdy");
	var celkemNaklady = document.getElementById("celkemNaklady");
	var celkemCashFlow = document.getElementById("celkemCashFlow");
	
	var prodejZiskVal = 0;
	var celkemZiskVal = 0;
	var nakladyMaterialVal = 0;
	var nakladyMzdyVal = 0;
	var celkemNakladyVal = 0;
	var celkemCashFlowVal = 0;
	
	
	database.ref('materials').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			var materialData = childSnapshot.val();
			var itemsPrice = materialData.price * materialData.stock;
			nakladyMaterialVal += itemsPrice;
			console.log(nakladyMaterialVal + "id " + snapshot.key);
			nakladyMaterial.innerHTML = nakladyMaterialVal;
			celkemCashFlowVal -= itemsPrice;
			
			//celkemCashFlowVal = celkemNakladyVal + prodejZiskVal;
			
			//console.log(celkemCashFlowVal);
		})
		celkemCashFlow.innerHTML = celkemCashFlowVal;
	});
	
	database.ref('employyes').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const employyeeData = childSnapshot.val();
			nakladyMzdyVal += employyeeData.salary;
			console.log(nakladyMzdyVal + "id " + snapshot.key);
			celkemCashFlowVal -= nakladyMzdyVal;
			
			celkemCashFlow.innerHTML = celkemCashFlowVal;
			nakladyMzdy.innerHTML = nakladyMzdyVal;
			celkemNakladyVal = nakladyMzdyVal + nakladyMaterialVal;
			celkemNaklady.innerHTML = celkemNakladyVal;			
			

			celkemCashFlow.innerHTML = celkemCashFlowVal;	
			//console.log(celkemCashFlowVal);
		})
	});
	
	database.ref('orders').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val(); 	
			
			for(let i = 0; i < supplierData.items.length; i++) {
				let obj = supplierData.items[i];
				const productRef = database.ref('products/' + obj.productId);
				
				productRef.once('value').then(snapshot => {
					if(snapshot.val() != null){
					var productData = snapshot.val();
					var price = productData.price;
					var q = obj.quantity;
					var celkem = price * q;
					console.log(celkem);
					
					prodejZiskVal += celkem;
					prodejZisk.innerHTML = prodejZiskVal;
					
					celkemCashFlowVal += celkem;
					celkemCashFlow.innerHTML = celkemCashFlowVal;	
					/*
					//console.log(productData.price);
					var price2 = 0;
					price2 += productData.price * obj.quantity;
					//console.log(productData.price);
					console.log(productData.price);
					//console.log(price);
					prodejZiskVal += price;
					prodejZisk.innerHTML = prodejZiskVal;
					*/
					}
				})
				
			}
			
					
		});
			   
	})
	
      
}
function isDateBetween(from,to,actual){
	if((actual.getTime() >= from.getTime() && actual.getTime() <= to.getTime())){
		return true;
	}
	return false;
	
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






  


