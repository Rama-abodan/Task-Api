// عرض مؤشر التحميل
function showLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) loader.classList.remove('hidden');
}

// إخفاء مؤشر التحميل
function hideLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) loader.classList.add('hidden');
}

// دالة لجلب المنتجات من API مع معالجة الأخطاء
async function fetchProducts() {
    showLoading(); 
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error("error is load data");
        }
        
        const products = await response.json();
        console.log('Products loaded:', products);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        const productsContainer = document.getElementById('productsContainer');
        if (productsContainer) {
            productsContainer.innerHTML = `
                <div class="text-red-500 text-center p-4">
                    Error is loding data:
                    ${error.message}
                </div>
            `;
        }
        return [];
    }
    finally {
        hideLoading();
    }
}

// دالة لتهيئة القائمة المتنقلة
function initMobileMenu() {
    const menuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = menuButton.querySelector('svg');
            if (icon) {
                icon.innerHTML = mobileMenu.classList.contains('hidden') 
                    ? `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>`
                    : `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`;
            }
        });

        document.querySelectorAll('#mobileMenu li').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await fetchProducts();
        initMobileMenu();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// التحقق من وجود النموذج قبل إضافة event listener
const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const title = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const category = document.getElementById("category").value;
        const image = document.getElementById("image").value;
        const description = document.getElementById("description").value;
        
        if (!title || !price || !category || !image || !description) {
            alert("Please fill in all fields");
            return; 
        }

        
        if (category === "default") {
            alert("Please select a category");
            return;
        }

        const productData = {
            title,
            price,
            category,
            image,
            description,
            rating: {
                rate: 0,
                count: 0
            }
        };

        try {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Adding Product...";
            }
            
            const response = await fetch("https://fakestoreapi.com/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const data = await response.json();
            displayResult(data);
            this.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Add product";
            }
        }
    });
}

// دالة لعرض المنتج المضاف
function displayResult(product) {
    const resultDiv = document.getElementById("result");
    const productCard = document.getElementById("productCard");
    
    if (resultDiv && productCard) {
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" 
                class="w-full h-48 object-contain mb-4 rounded-lg">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${product.title}</h4>
            <p class="text-emerald-600 dark:text-emerald-400 font-bold">$${product.price}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">${product.category}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">${product.description}</p>
        `;
        
        resultDiv.style.display = "block";
        
        const viewAllBtn = document.getElementById("viewAllBtn");
        if (viewAllBtn) {
            viewAllBtn.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }
    }
}
