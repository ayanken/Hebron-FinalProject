// EcoCart basic JavaScript: navigation, product search/filter, cart feedback and product controls.
const products = [
    { id: 1, name: "Reusable Bamboo Bottle", category: "reusable", price: 450, description: "A reusable bottle for everyday hydration.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80", badge: "Bestseller", natural: true },
    { id: 2, name: "Organic Canvas Tote", category: "bags", price: 280, description: "A handy bag for shopping and daily errands.", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=700&q=80", badge: "Popular", natural: true },
    { id: 3, name: "Reusable Food Container", category: "kitchen", price: 390, description: "Keep snacks and meals stored for later.", image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80", badge: "Everyday pick", natural: false },
    { id: 4, name: "Bamboo Toothbrush Set", category: "home", price: 160, description: "A simple bathroom swap with a natural look.", image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80", badge: "Eco choice", natural: true },
    { id: 5, name: "Glass Storage Jar", category: "kitchen", price: 220, description: "Organize pantry essentials in reusable glass.", image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80", badge: "Simple living", natural: false },
    { id: 6, name: "Reusable Produce Bag", category: "bags", price: 120, description: "A lightweight option for market trips.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80", badge: "Budget friendly", natural: true },
    { id: 7, name: "Natural Home Planter", category: "home", price: 520, description: "Bring a little greenery into your space.", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80", badge: "Fresh pick", natural: true },
    { id: 8, name: "Insulated Travel Cup", category: "reusable", price: 580, description: "A reusable cup for drinks on the go.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80", badge: "Daily essential", natural: false }
];

function getCart() {
    try { return JSON.parse(localStorage.getItem("ecocart-items") || "[]"); }
    catch (error) { return []; }
}
function saveCart(cart) {
    localStorage.setItem("ecocart-items", JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}
function addToCart(productId, quantity = 1, color = "Standard") {
    const product = products.find(item => item.id === Number(productId));
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id && item.color === color);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity, color });
    saveCart(cart);
    showToast(`Great choice! ${product.name} added to your cart.`);
}
function productCard(product) {
    return `<article class="product-card">
        <a class="product-card-image" href="product.html" aria-label="View ${product.name} details">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <span class="product-badge">${product.badge}</span>
        </a>
        <div class="product-card-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="card-bottom"><span class="card-price">₱${product.price.toLocaleString("en-PH", {minimumFractionDigits: 2})}</span>
            <button class="mini-add" type="button" data-add="${product.id}">Add to cart +</button></div>
        </div>
    </article>`;
}
function bindAddButtons(container) {
    if (!container) return;
    container.querySelectorAll("[data-add]").forEach(button => {
        button.addEventListener("click", () => addToCart(button.dataset.add));
    });
}

// Responsive navigation menu
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
}

// Home page featured products
const featuredProducts = document.getElementById("featuredProducts");
if (featuredProducts) {
    featuredProducts.innerHTML = products.slice(0, 4).map(productCard).join("");
    bindAddButtons(featuredProducts);
}

// Shop page: search, category, price and benefit filters
const shopProducts = document.getElementById("shopProducts");
if (shopProducts) {
    const search = document.getElementById("productSearch");
    const sort = document.getElementById("sortProducts");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const reusableOnly = document.getElementById("reusableOnly");
    const naturalOnly = document.getElementById("naturalOnly");
    const resultCount = document.getElementById("resultCount");
    const activeFilters = document.getElementById("activeFilters");
    const emptyState = document.getElementById("emptyState");

    function renderShop() {
        const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "all";
        const min = Number(minPrice.value || 0);
        const max = Number(maxPrice.value || 5000);
        const term = search.value.trim().toLowerCase();
        let shown = products.filter(product => {
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
            const matchesPrice = product.price >= min && product.price <= max;
            const matchesTerm = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term);
            const matchesReusable = !reusableOnly.checked || product.category === "reusable" || product.category === "bags";
            const matchesNatural = !naturalOnly.checked || product.natural;
            return matchesCategory && matchesPrice && matchesTerm && matchesReusable && matchesNatural;
        });
        if (sort.value === "low") shown.sort((a, b) => a.price - b.price);
        if (sort.value === "high") shown.sort((a, b) => b.price - a.price);
        if (sort.value === "name") shown.sort((a, b) => a.name.localeCompare(b.name));
        shopProducts.innerHTML = shown.map(productCard).join("");
        bindAddButtons(shopProducts);
        resultCount.textContent = `Showing ${shown.length} of ${products.length} products`;
        emptyState.hidden = shown.length !== 0;
        shopProducts.hidden = shown.length === 0;
        const chips = [];
        if (selectedCategory !== "all") chips.push(selectedCategory);
        if (term) chips.push(`Search: ${term}`);
        if (reusableOnly.checked) chips.push("Reusable");
        if (naturalOnly.checked) chips.push("Natural materials");
        activeFilters.innerHTML = chips.length ? chips.map(chip => `<span>${chip}</span>`).join("") : "<span>All products</span>";
    }
    document.querySelectorAll('input[name="category"]').forEach(input => input.addEventListener("change", renderShop));
    [search, sort, minPrice, maxPrice, reusableOnly, naturalOnly].forEach(input => input.addEventListener("input", renderShop));
    document.getElementById("clearFilters").addEventListener("click", clearFilters);
    document.getElementById("emptyClear").addEventListener("click", clearFilters);
    function clearFilters() {
        document.querySelector('input[name="category"][value="all"]').checked = true;
        search.value = "";
        sort.value = "popular";
        minPrice.value = "0";
        maxPrice.value = "5000";
        reusableOnly.checked = false;
        naturalOnly.checked = false;
        renderShop();
        showToast("Filters cleared. Take your time exploring!");
    }
    const params = new URLSearchParams(window.location.search);
    const categoryFromLink = params.get("category");
    if (categoryFromLink && document.querySelector(`input[name="category"][value="${categoryFromLink}"]`)) {
        document.querySelector(`input[name="category"][value="${categoryFromLink}"]`).checked = true;
    }
    renderShop();
}

// Product details page controls
const quantityInput = document.getElementById("quantity");
if (quantityInput) {
    const quantityError = document.getElementById("quantityError");
    const productSuccess = document.getElementById("productSuccess");
    function setQuantity(next) {
        const value = Number(next);
        if (!Number.isInteger(value) || value < 1 || value > 10) {
            quantityError.textContent = "Please choose a quantity from 1 to 10.";
            return false;
        }
        quantityInput.value = value;
        quantityError.textContent = "";
        return true;
    }
    document.getElementById("qtyMinus").addEventListener("click", () => setQuantity(Number(quantityInput.value) - 1));
    document.getElementById("qtyPlus").addEventListener("click", () => setQuantity(Number(quantityInput.value) + 1));
    quantityInput.addEventListener("input", () => setQuantity(quantityInput.value));
    const addDetailCart = () => {
        if (!setQuantity(quantityInput.value)) return;
        addToCart(1, Number(quantityInput.value), document.getElementById("bottleColor").value);
        productSuccess.textContent = "Great job choosing a reusable option! Your cart has been updated.";
    };
    document.getElementById("addDetailCart").addEventListener("click", addDetailCart);
    document.getElementById("buyNow").addEventListener("click", () => {
        if (!setQuantity(quantityInput.value)) return;
        addDetailCart();
        showToast("Your item is ready in the cart. Checkout can be added in the next project stage.");
    });

    // Product image thumbnails
    document.querySelectorAll(".thumbnail").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("mainProductImage").src = button.dataset.image;
            document.querySelectorAll(".thumbnail").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

updateCartCount();
