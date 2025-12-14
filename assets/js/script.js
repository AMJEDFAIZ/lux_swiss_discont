// ==========================================
// 1. إعدادات المتجر
// ==========================================
const GOOGLE_SCRIPT_URL =
	"https://script.google.com/macros/s/AKfycbzzrMycvpgFCh6DwqGXsBsLXtb6_FmDqv9JV31uSPWBLn_sjmqDJ1FBIXKhdhG_o0LA/exec";
const WHATSAPP_NUMBER = "967775226109";
const DELIVERY_COST = 1000;
const CURRENCY = "ريال";

// ==========================================
// 2. المنتجات
// ==========================================
const products = [
	{
		id: "PROD-001",
		name: "ساعة رولكس GMT  اوتوماتيك",
		oldPrice: "40000",
		price: "32000",
		image: "assets/img/اوتوماتيك3.jpg",
	},
	{
		id: "PROD-002",
		name: " ساعة  بلغاري نسائي ",
		oldPrice: "10500",
		price: "9700",
		image: "assets/img/بلغاري قفل.jpeg",
	},
	{
		id: "PROD-003",
		name: "ساعة رولكس ديتونا رجالي",
		oldPrice: "14900",
		price: "13900",
		image: "assets/img/كوبي ون.jpg",
	},
	{
		id: "PROD-004",
		name: "ساعة ثعبان بلغاري لفة ",
		oldPrice: "17900",
		price: "16500",
		image: "assets/img/ثعبان لفه.jpeg",
	},
	{
		id: "PROD-005",
		name: "ساعة ثعبان بلغاري لفتين ",
		oldPrice: "17900",
		price: "16500",
		image: "assets/img/ثعبان بلغاري لفتين.jpg",
	},
	{
		id: "PROD-006",
		name: "ساعة اكسلانس  رجالي",
		oldPrice: "10500",
		price: "9700",
		image: "assets/img/اكسلانس شبيه الكارتير.jpg",
	},
];

// ==========================================
// 3. عرض المنتجات
// ==========================================
const grid = document.getElementById("productsWrapper");

products.forEach((product) => {
	const card = `
        <div class="product-card">
            <div class="product-img-wrapper" >
                <img src="${product.image}" class="product-img" alt="${product.name}">
            </div>
            <div class="card-body">
                <span class="prod-id">#${product.id}</span>
                <h3>${product.name}</h3>
                <div class="price-box">
                    <span class="new-price">${product.price} <small>${CURRENCY}</small></span>
                    <span class="old-price">${product.oldPrice}</span>
                </div>
                <button class="btn-order" onclick="openModal('${product.id}')">
                    <i class="fa-solid fa-cart-plus"></i> اطلب الآن
                </button>
            </div>
        </div>
    `;
	grid.innerHTML += card;
});

// ==========================================
// 4. منطق النافذة
// ==========================================
let currentShippingMode = "inside";

function openModal(productId) {
	const product = products.find((p) => p.id === productId);

	// UI Update
	document.getElementById("modalImg").src = product.image;
	document.getElementById("modalProdName").innerText = product.name;
	document.getElementById("modalProdID").innerText = `Ref: ${product.id}`;

	// Hidden Fields
	document.getElementById("h_prodId").value = product.id;
	document.getElementById("h_prodName").value = product.name;
	document.getElementById("h_price").value = product.price;
	document.getElementById("h_imgUrl").value = product.image;

	setShipping("inside"); // Reset to default
	document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
	document.getElementById("orderModal").style.display = "none";
}

function setShipping(mode) {
	currentShippingMode = mode;
	const basePrice = parseFloat(document.getElementById("h_price").value);

	document.getElementById("optInside").classList.remove("active");
	document.getElementById("optOutside").classList.remove("active");

	let finalShipping = 0;
	let total = 0;
	let note = "";
	let noteColor = "var(--primary)";
	const addressLabel = document.getElementById("addressLabel");
	const addressInput = document.getElementById("address");

	if (mode === "inside") {
		document.getElementById("optInside").classList.add("active");
		finalShipping = DELIVERY_COST;
		total = basePrice + finalShipping;
		note = '<i class="fa-solid fa-circle-check"></i> الدفع عند الاستلام متاح';
		document.getElementById("shippingRow").style.display = "flex";

		// لتعديل الحقول العنوان بحسب المنطقة
		addressLabel.innerHTML =
			'<i class="fa-regular fa-map"></i> العنوان بالتفصيل';
		addressInput.placeholder = "الشارع، المعلم القريب...";
	} else {
		document.getElementById("optOutside").classList.add("active");
		finalShipping = 0;
		total = basePrice;
		note =
			'<i class="fa-solid fa-circle-info"></i> الشحن والدفع يحدد عبر الواتساب';
		noteColor = "#d32f2f"; // أحمر للتنبيه
		document.getElementById("shippingRow").style.display = "none";
		addressLabel.innerHTML =
			'<i class="fa-regular fa-map"></i> المحافظة/المدينة';
		addressInput.placeholder = "مثال: عدن، حضرموت، تعز...";
	}

	document.getElementById("summaryPrice").innerText = basePrice;
	document.getElementById("summaryShip").innerText = finalShipping;
	document.getElementById("summaryTotal").innerText = total;

	const noteElement = document.getElementById("paymentNote");
	noteElement.innerHTML = note;
	noteElement.style.color = noteColor;
}

// ==========================================
// 5. إرسال الطلب
// ==========================================
function submitOrder(e) {
	e.preventDefault();
	const btn = document.querySelector(".submit-btn");
	const originalContent = btn.innerHTML;

	btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
	btn.disabled = true;

	// جمع البيانات
	const formData = {
		date: new Date().toLocaleDateString("en"),
		orderId: Math.floor(Math.random() * 100000),
		name: document.getElementById("name").value,
		phone: document.getElementById("phone").value,
		address: document.getElementById("address").value,
		notes: document.getElementById("notes").value, // تم إصلاح الحقل هنا
		locationType:
			currentShippingMode === "inside" ? "داخل صنعاء" : "خارج صنعاء",

		prodId: document.getElementById("h_prodId").value,
		prodName: document.getElementById("h_prodName").value,
		price: document.getElementById("h_price").value,
		imgUrl: document.getElementById("h_imgUrl").value,

		shippingFee:
			currentShippingMode === "inside" ? DELIVERY_COST : "يحدد لاحقاً",
		total: document.getElementById("summaryTotal").innerText,
	};

	fetch(GOOGLE_SCRIPT_URL, {
		method: "POST",
		mode: "no-cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	})
		.then(() => {
			// رسالة الواتساب
			let msg =
				`*تفاصيل الطلب* 🛍️%0a` +
				`رقم الطلب: ${formData.orderId}%0a` +
				`-----------------------%0a` +
				`*العميل:* ${formData.name}%0a` +
				`*الجوال:* ${formData.phone}%0a` +
				`*العنوان:* ${formData.address}%0a` +
				`*ملاحظات:* ${formData.notes}%0a` +
				`*الموقع:* ${formData.locationType}%0a` +
				`-----------------------%0a` +
				`*المنتج:* ${formData.prodName}%0a` +
				`*كود:* ${formData.prodId}%0a` +
				`*السعر:* ${formData.price} ${CURRENCY}%0a`;

			if (currentShippingMode === "inside") {
				msg +=
					`*التوصيل:* ${DELIVERY_COST} ${CURRENCY}%0a` +
					`*الإجمالي:* ${formData.total} ${CURRENCY} (عند الاستلام)`;
			} else {
				msg += `⚠️ *الطلب خارج صنعاء، يرجى التنسيق للدفع والشحن.*`;
			}

			window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

			btn.innerHTML = originalContent;
			btn.disabled = false;
			closeModal();
			document.getElementById("orderForm").reset();
		})
		.catch((err) => {
			alert("حدث خطأ في الشبكة، سيتم نقلك للواتساب.");
			window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
			btn.innerHTML = originalContent;
			btn.disabled = false;
		});
}

// إغلاق عند النقر خارج المودال
window.onclick = function (event) {
	if (event.target == document.getElementById("orderModal")) closeModal();
};
