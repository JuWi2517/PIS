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
    firebase.app(); 
}

const database = firebase.database();

document.addEventListener('DOMContentLoaded', async function() {
    await populateDateSelectors();
    document.getElementById("yearSelect").addEventListener("change", updateCashFlow);
    document.getElementById("monthSelect").addEventListener("change", updateCashFlow);
    updateCashFlow();
});

async function populateDateSelectors() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');

    const ordersSnapshot = await database.ref('orders').once('value');
    const orders = ordersSnapshot.val();

    const yearMonths = new Set();
    Object.values(orders).forEach(order => {
        const date = new Date(order.timestamp);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        yearMonths.add(yearMonth);
    });

    const years = {};
    yearMonths.forEach(yearMonth => {
        const [year, month] = yearMonth.split('-');
        if (!years[year]) {
            years[year] = new Set();
        }
        years[year].add(parseInt(month));
    });

    Object.keys(years).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        monthSelect.innerHTML = '';
        Array.from(years[selectedYear]).sort().forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
            monthSelect.appendChild(option);
        });
        updateCashFlow();
    });

    yearSelect.dispatchEvent(new Event('change'));
}

async function updateCashFlow() {
    const year = document.getElementById('yearSelect').value;
    const month = document.getElementById('monthSelect').value;

    const startDate = new Date(year, month - 1, 1).getTime();
    const endDate = new Date(year, month, 0, 23, 59, 59).getTime();

    await getCashFlow(startDate, endDate);
    displayDateRange(startDate, endDate);
}

function displayDateRange(startDate, endDate) {
    console.log(`Raw Start Date: ${startDate}, Raw End Date: ${endDate}`);

    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(`Converted Start Date: ${start.toString()}, Converted End Date: ${end.toString()}`);

    const formattedStart = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedEnd = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById("dateRangeDisplay").textContent = `Showing cash flow from ${formattedStart} to ${formattedEnd}`;
}

async function getCashFlow(from, to) {
    let [materialsCost, salariesCost, salesRevenue] = await Promise.all([
        calculateMaterialsCost(),
        calculateSalariesCost(from, to),
        calculateSalesRevenue(from, to),
    ]);

    let totalCosts = materialsCost + salariesCost;
    let totalProfit = salesRevenue - totalCosts;
    let totalCashFlow = totalProfit;

    document.getElementById("nakladMaterial").innerHTML = materialsCost.toFixed(2);
    document.getElementById("nakladMzdy").innerHTML = salariesCost.toFixed(2);
    document.getElementById("celkemNaklady").innerHTML = totalCosts.toFixed(2);
    document.getElementById("prodejZisk").innerHTML = salesRevenue.toFixed(2);
    document.getElementById("celkemZisk").innerHTML = salesRevenue.toFixed(2);
    document.getElementById("celkemCashFlow").innerHTML = totalCashFlow.toFixed(2);

    const revenueRow = document.getElementById("revenue");
    if (totalCashFlow < 0) {
        revenueRow.style.backgroundColor = "#E91414"; // Red
    } else {
        revenueRow.style.backgroundColor = "#41D705"; // Green
    }
}

async function calculateMaterialsCost() {
    try {
        let totalCost = 0;
        const snapshot = await database.ref('materials').once('value');
        snapshot.forEach(childSnapshot => {
            let materialData = childSnapshot.val();
            totalCost += Number(materialData.price) * (materialData.stock || 0);
        });
        return totalCost;
    } catch (error) {
        console.error("Failed to calculate materials cost:", error);
        return 0;
    }
}

async function calculateSalariesCost(from, to) {
    let totalSalaries = 0;
    const snapshot = await database.ref('employyes').once('value');
    snapshot.forEach(childSnapshot => {
        let employeeData = childSnapshot.val();
        let employeeStartDate = employeeData.created; 
        let salary = parseFloat(employeeData.salary);
        if (!isNaN(salary) && employeeStartDate >= from && employeeStartDate <= to) {
            totalSalaries += salary;
        }
    });
    return totalSalaries;
}
  
async function calculateSalesRevenue(from, to) {
	let totalRevenue = 0;
	const ordersSnapshot = await database.ref('orders').once('value');
	const orders = ordersSnapshot.val();
	if (orders) {
	  for (const orderId of Object.keys(orders)) {
		const orderData = orders[orderId];
		if (orderData.timestamp >= from && orderData.timestamp <= to) {
		  for (const item of orderData.items) {
			const productSnapshot = await database.ref('products/' + item.productId).once('value');
			if (productSnapshot.exists()) {
			  let productData = productSnapshot.val();
			  totalRevenue += Number(productData.price) * item.quantity;
			}
		  }
		}
	  }
	}
	return totalRevenue;
}