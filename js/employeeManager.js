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
const auth = firebase.auth();	
 
function createEmployee() {
	
	const employeeName = document.getElementById('eName').value;
	const employeeAdress= document.getElementById('eAdress').value;
	const employeePhone = document.getElementById('ePhone').value;	
	const employeeBankAcount = document.getElementById('eBankAccount').value;
	const employeeSalary = document.getElementById('eSalary').value;

	const employeeEmail = document.getElementById('eEmail').value;
	const employeePass = document.getElementById('ePass').value;

	const newSupplierRef = database.ref('employyes').push();
	
	auth.createUserWithEmailAndPassword(employeeEmail, employeePass)
	.then((userCredential) => {
		const user = userCredential.user;			
		database.ref('employyes/' + user.uid).set({
			name: employeeName,
			adress:employeeAdress,
			email: employeeEmail,
			phone: employeePhone,		
			bank_account: employeeBankAcount,
			salary: parseInt(employeeSalary), 
			uid: user.uid,
			created: firebase.database.ServerValue.TIMESTAMP
		});
		window.location.href = "zamestnanci.html";
		console.log("Registrace se zdařila")
	})
	.catch((error) => {
		console.log('chyba' + error)
	});
	
	//window.location.href = "zamestnanci.html";
	
}
function updateEmployee(id,data){
	  
	const employeeName = document.getElementById('eName').value;
	const employeeAdress= document.getElementById('eAdress').value;
	const employeeEmail = document.getElementById('eEmail').value;
	const employeePhone = document.getElementById('ePhone').value;	
	const employeeBankAcount = document.getElementById('eBankAccount').value;
	const employeeSalary = document.getElementById('eSalary').value;
	const employeePass = document.getElementById('ePass').value;
	const employeeTimeStamp = document.getElementById('eTimestamp').value;

	var idSupplierHid = document.getElementById('eId');	
	id = idSupplierHid.value;
	
	const newSupplierRef = database.ref('employyes/' + id);
		newSupplierRef.set({  		
			name: employeeName,
			adress:employeeAdress,
			email: employeeEmail,
			phone: employeePhone,		
			bank_account: employeeBankAcount,
			uid: id,
			salary: parseInt(employeeSalary), 
			created: parseInt(employeeTimeStamp)
		});
	window.location.href = "zamestnanci.html";
}
function deleteEmployee(productId) {
	const productRef = database.ref('employyes/' + productId);
	productRef.remove();
	location.reload("zamestnanci.html");
}
  
function getEmployeeById(container,id){
	const employeeName = document.getElementById('eName');
	const employeeAdress= document.getElementById('eAdress');
	const employeeEmail = document.getElementById('eEmail');
	const employeePhone = document.getElementById('ePhone');	
	const employeeBankAcount = document.getElementById('eBankAccount');
	const employeeSalary = document.getElementById('eSalary');
	const employeeTimeStamp = document.getElementById('eTimestamp').value;
	
	database.ref('employyes/' + id).once('value')
	.then(snapshot => {
		const employeeData = snapshot.val();
		
		employeeName.value = employeeData.name;
		employeeAdress.value  = employeeData.adress;
		employeeEmail.value  = employeeData.email;
		employeePhone.value  = employeeData.phone;
		employeeBankAcount.value  = employeeData.bank_account;
		employeeSalary.value  = employeeData.salary;
		employeeTimeStamp.value = employeeData.created;

	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});	 
}
function getAllEmployees(container){
	const products = new Array();
	var table = document.getElementById(container);
	table.innerHTML = "";
	var row = addRowCells(table,6); 
	setCellText(row,0,"Jméno, příjmení");	
	setCellText(row,1,"Adresa");	
	setCellText(row,2,"Email");	
	setCellText(row,3,"Telefon");
	setCellText(row,4,"Bankovní účet");
	setCellText(row,5,"Mzda");
	
	 
	database.ref('employyes').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const employeeData = childSnapshot.val();          
		  
			var cellUpdate = '<a href="editZamestnanec.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			var cellShow= '<a href="showZamestnanec.html?id=' + childSnapshot.key + '" class="btn btn-primary">Ukázat</a>';
			var cellRemove = '<input class="btn btn-danger" type="submit" onclick="deleteEmployee(\'' + childSnapshot.key + '\');" value="Smazat">';  
			var row = addRowCells(table,9);
			
			setCellText(row,0,employeeData.name);	
			setCellText(row,1,employeeData.adress);	
			setCellText(row,2,employeeData.email);	
			setCellText(row,3,employeeData.phone);
			setCellText(row,4,employeeData.bank_account);
			setCellText(row,5,employeeData.salary);
	
	
			
			setCellText(row,6,cellUpdate);
			setCellText(row,7,cellShow);
			setCellText(row,8,cellRemove);
			
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;

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
  





  


