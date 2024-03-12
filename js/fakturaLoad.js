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



function renderOrder(orderId) {
    var database = firebase.database();
    var orderRef = database.ref('orders').child(orderId);
    var productsRef = database.ref('products');

    var datumVystaveni = document.getElementById("datumVystaveni");
    var datumSplatnosti = document.getElementById("datumSplatnosti");
    var datumZdan = document.getElementById("datumZdan");
    var elementWithoutDPH = document.getElementById("totalWithoutDPH");
    var elementWithDPH = document.getElementById("totalWithDPH");
    var elementSazbaDPH = document.getElementById("totalSazbaDPH");

    // Retrieve the data for the specific order and products
    Promise.all([orderRef.once('value'), productsRef.once('value')])
        .then(function([orderSnapshot, productsSnapshot]) {
            var order = orderSnapshot.val();
            var products = productsSnapshot.val();

            if (order) {
                console.log("Order ID:", orderId);
                var formattedDate = new Date(order.timestamp).toDateString();
                console.log("Order Date:", formattedDate);
                datumVystaveni.innerHTML = formattedDate;
                datumSplatnosti.innerHTML = formattedDate;
                datumZdan.innerHTML = formattedDate;

                // Get reference to existing div with id "polozky"
                var polozkyDiv = document.getElementById('polozky');

                // Create table element
                var table = document.createElement('table');
                table.style.display = 'table';
                table.style.width = '100%';
                table.style.margin = '20px';

                // Create table header row
                var headerRow = table.insertRow();
                ['Zboží', 'DPH', 'Cena za kus bez DPH', 'Cena za kus s DPH', 'Počet kusů', 'Cena Celkem'].forEach(function(headerText) {
                    var headerCell = document.createElement('td');
                    headerCell.textContent = headerText;
                    headerRow.appendChild(headerCell);
                });

                var totalPriceWithoutDPH = 0;
                var totalPriceWithDPH = 0;

                order.items.forEach(function(item) {
                    var product = products[item.productId];
                    if (product) {
                        var row = table.insertRow();
                        ['name', 'dph', 'priceWithoutDPH', 'price', 'quantity', 'totalPrice'].forEach(function(property) {
                            var cell = row.insertCell();
                            if (property === 'dph') {
                                cell.textContent = '18%'; 
                            } else if (property === 'quantity') {
                                cell.textContent = item.quantity+" Ks"; 
                            } else if (property === 'priceWithoutDPH') {
                                var priceWithoutDPH = parseFloat(product['price']) * 0.82;
                                cell.textContent = priceWithoutDPH.toFixed(2)+" Kč"; 
                                totalPriceWithoutDPH += priceWithoutDPH*item.quantity; 
                            } else if (property === 'totalPrice') {
                                var totalPrice = parseFloat(product['price']) * item.quantity;
                                cell.textContent = totalPrice.toFixed(2)+" Kč";
                                totalPriceWithDPH += totalPrice; 
                            } else if (property === 'price') {
                                cell.textContent = product['price'] + ' Kč';
                            } else {
                                cell.textContent = product[property];
                            }
                        });
                    }
                });
                elementSazbaDPH.innerHTML = (totalPriceWithDPH - totalPriceWithoutDPH).toFixed(2)+" Kč";
                elementWithDPH.innerHTML = totalPriceWithDPH.toFixed(2)+" Kč";
                elementWithoutDPH.innerHTML = totalPriceWithoutDPH.toFixed(2)+" Kč";

                // Append table to the existing "polozky" div
                polozkyDiv.appendChild(table);
            } else {
                console.log("Order with ID", orderId, "not found.");
            }
        })
        .catch(function(error) {
            console.log('Error retrieving order or products:', error);
        });
}



window.onload = function() {
    renderOrder("-NrtMN9pZhEZ7JxCa-9m");
};