// ==========================================
// 1. إعدادات المتجر
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7w_H42tAuxc4gT4q5rqt9N91xkCogFehsHhxO_bip7icAo91DjERwJOJTwVl5Dy8bDw/exec";
const WHATSAPP_NUMBER = "967772983550";
const DELIVERY_COST = 1000;
const CURRENCY = "ريال";

// ==========================================
// 2. المنتجات 
// ==========================================
const products = [
    {
        id: "PROD-001",
        name: "ساعة رولكس GMT اوتوماتيك",
        description: "تصميم فاخر مقاوم للخدش، ماكينة أوتوماتيكية عالية الدقة.", 
        oldPrice: "40000",
        price: "32000",
        image: "assets/img/اوتوماتيك3.jpg",
    },
    {
        id: "PROD-002",
        name: "ساعة بلغاري نسائي",
        description: "أناقة لا تضاهى، تصميم القفل الشهير، مناسبة للسهرات.",
        oldPrice: "10500",
        price: "9700",
        image: "assets/img/بلغاري قفل.jpeg",
    },
    {
        id: "PROD-003",
        name: "ساعة رولكس ديتونا رجالي",
        description: "نسخة كوبي ون، عدادات كرونوغراف تعمل بالكامل.",
        oldPrice: "14900",
        price: "13900",
        image: "assets/img/كوبي ون.jpg",
    },
    {
        id: "PROD-004",
        name: "ساعة ثعبان بلغاري لفة",
        description: "تصميم الثعبان الملتف العصري، طلاء ثابت ولون ذهبي.",
        oldPrice: "17900",
        price: "16500",
        image: "assets/img/ثعبان لفه.jpeg",
    },
    {
        id: "PROD-005",
        name: "ساعة ثعبان بلغاري لفتين",
        description: "تميزي بإطلالة فريدة مع تصميم اللفتين الجذاب.",
        oldPrice: "17900",
        price: "16500",
        image: "assets/img/ثعبان بلغاري لفتين.jpg",
    },
    {
        id: "PROD-006",
        name: "ساعة اكسلانس رجالي",
        description: "تصميم كلاسيكي شبيه كارتير، خفيفة وعملية للاستخدام اليومي.",
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
            <div class="product-img-wrapper">
                <img src="${product.image}" class="product-img" alt="${product.name}">
            </div>
            <div class="card-body">
                <span class="prod-id">#${product.id}</span>
                <h3 class="prod-title">${product.name}</h3>
                
                <p class="prod-desc">${product.description}</p>
                
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
// 4. هيكل النافذة
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

    setShipping("inside"); // Reset 
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

        addressLabel.innerHTML = '<i class="fa-regular fa-map"></i> العنوان بالتفصيل';
        addressInput.placeholder = "الشارع، المعلم القريب...";
    } else {
        document.getElementById("optOutside").classList.add("active");
        finalShipping = 0;
        total = basePrice;
        note = '<i class="fa-solid fa-circle-info"></i> الشحن والدفع يحدد عبر الواتساب';
        noteColor = "#d32f2f";
        document.getElementById("shippingRow").style.display = "none";
        addressLabel.innerHTML = '<i class="fa-regular fa-map"></i> المحافظة/المدينة';
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

    // تغيير شكل الزر للدلالة على التحميل
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled = true;

    // 1. تجميع البيانات كاملة
    const formDataObj = {
        date: new Date().toLocaleDateString("en-GB"), // التاريخ
        orderId: Math.floor(Math.random() * 10000),   // رقم الطلب
        name: document.getElementById("name").value,  // الاسم
        phone: document.getElementById("phone").value, // الهاتف
        address: document.getElementById("address").value, // العنوان
        notes: document.getElementById("notes").value, // الملاحظات
        locationType: currentShippingMode === "inside" ? "داخل صنعاء" : "خارج صنعاء",
        prodId: document.getElementById("h_prodId").value, // كود المنتج
        prodName: document.getElementById("h_prodName").value, // اسم المنتج
        price: document.getElementById("h_price").value, // السعر
        imgUrl: document.getElementById("h_imgUrl").value, // رابط الصورة
        shippingFee: currentShippingMode === "inside" ? DELIVERY_COST : "يحدد لاحقاً",
        total: document.getElementById("summaryTotal").innerText + " " + CURRENCY,
        currency: CURRENCY
    };

    // 2. تحويل البيانات (Form Data) لإرسالها لجوجل شيت وتيليجرام
    const urlParams = new URLSearchParams();
    for (const key in formDataObj) {
        urlParams.append(key, formDataObj[key]);
    }

    // 3. الإرسال إلى Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: urlParams
    })
    .then(() => {
        // --- بناء رسالة واتساب    ---
        
        let msg = 
            `*بيانات الطلب* 🛍️%0a` +
            `التاريخ: ${formDataObj.date}%0a` +
            `رقم الطلب: ${formDataObj.orderId}%0a` +
            `-----------------------%0a` +
            `*👤 بيانات العميل:*%0a` +
            `الاسم: ${formDataObj.name}%0a` +
            `الجوال: ${formDataObj.phone}%0a` +
            `العنوان: ${formDataObj.address}%0a` +
            `الموقع: ${formDataObj.locationType}%0a` +
            `ملاحظات: ${formDataObj.notes ? formDataObj.notes : "لا يوجد"}%0a` +
            `-----------------------%0a` +
            `*⌚ تفاصيل المنتج:*%0a` +
            `المنتج: ${formDataObj.prodName}%0a` +
            `الكود: ${formDataObj.prodId}%0a` +
            `السعر: ${formDataObj.price} ${CURRENCY}%0a`;

        // إضافة التفاصيل المالية حسب نوع الشحن
        if (currentShippingMode === "inside") {
            msg += `رسوم التوصيل: ${DELIVERY_COST} ${CURRENCY}%0a` +
                   `*الإجمالي النهائي:* ${formDataObj.total} (دفع عند الاستلام)`;
        } else {
            msg += `الشحن: خارج صنعاء (يحدد لاحقاً)%0a` +
                   `*الإجمالي المبدئي:* ${formDataObj.total}%0a` +
                   `⚠️ *تنبيه:* يرجى التواصل لتنسيق الشحن والدفع.`;
        }

        // إضافة رابط الصورة في النهاية (اختياري)
        // msg += `%0a-----------------------%0aصورة المنتج: ${window.location.href.split('#')[0] + formDataObj.imgUrl}`; 

        // فتح الواتساب
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

        // إعادة ضبط النموذج
        btn.innerHTML = originalContent;
        btn.disabled = false;
        closeModal();
        document.getElementById("orderForm").reset();
    })
    .catch((err) => {
        console.error(err);
        alert("حدث خطأ في الاتصال، سيتم نقلك للواتساب.");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
        btn.innerHTML = originalContent;
        btn.disabled = false;
    });
}