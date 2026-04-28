// app.js
// 1. Firebase Sozlamalari (Buni o'zingizning Firebase konsolingizdan olasiz)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const app = {
    // Navigatsiya
    nav: function(id, el) {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        document.getElementById(id).style.display = 'block';
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        if(id === 'hisobot') this.loadReport();
    },

    // Mahsulot qo'shish (Ombor)
    addProduct: function() {
        const data = {
            name: document.getElementById('p_name').value,
            cost: Number(document.getElementById('p_cost').value),
            price: Number(document.getElementById('p_price').value)
        };
        const code = document.getElementById('p_barcode').value;
        if(code && data.name) {
            db.ref('products/' + code).set(data);
            alert("Mahsulot saqlandi!");
            document.querySelectorAll('input').forEach(i => i.value = '');
        }
    },

    // Sotuv jarayoni
    processSale: function(code) {
        db.ref('products/' + code).once('value', (snap) => {
            const p = snap.val();
            if(p) {
                const sale = { ...p, code, date: Date.now() };
                db.ref('sales').push(sale);
                document.getElementById('sale_list').innerHTML += `<p>✅ ${p.name} - ${p.price} so'm</p>`;
                document.getElementById('scan_code').value = '';
            }
        });
    },

    // Xarajatlarni saqlash
    addExpense: function() {
        const exp = {
            type: document.getElementById('exp_type').value,
            amount: Number(document.getElementById('exp_amount').value),
            date: Date.now()
        };
        db.ref('expenses').push(exp).then(() => {
            alert("Xarajat kiritildi");
            document.getElementById('exp_amount').value = '';
        });
    },

    // Hisobot va Sof Foyda hisobi
    loadReport: function() {
        let totalSales = 0, totalCost = 0, totalExp = 0;

        db.ref('sales').once('value', (snap) => {
            snap.forEach(child => {
                totalSales += child.val().price;
                totalCost += child.val().cost;
            });
            
            db.ref('expenses').once('value', (exSnap) => {
                exSnap.forEach(ex => totalExp += ex.val().amount);
                
                document.getElementById('stat_sales').innerText = totalSales + " so'm";
                document.getElementById('stat_cost').innerText = totalCost + " so'm";
                document.getElementById('stat_exp').innerText = totalExp + " so'm";
                document.getElementById('stat_profit').innerText = (totalSales - totalCost - totalExp) + " so'm";
            });
        });
    }
};
