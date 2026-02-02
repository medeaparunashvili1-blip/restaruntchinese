const API_URL = 'https://restaurant.stepprojects.ge/api/Products/GetAll';
const API_CATEGORY_URL = 'https://restaurant.stepprojects.ge/api/Products/GetFiltered?category=';

let allDishes = [];
let cart = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadDishes();
    setupEventListeners();
    updateCartUI();
});

function setupEventListeners() {
    document.getElementById('menu-btn').addEventListener('click', showMenuPage);
    document.getElementById('cart-btn').addEventListener('click', showCartPage);

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            if (currentCategory === 'all') {
                loadDishes();
            } else {
                loadDishesByCategory(currentCategory);
            }
        });
    });

    document.getElementById('spiciness-filter').addEventListener('change', applyFilters);
    document.getElementById('nuts-filter').addEventListener('change', applyFilters);
    document.getElementById('vegetarian-filter').addEventListener('change', applyFilters);

    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

function loadDishes() {
    showLoading(true);
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            allDishes = data;
            applyFilters();
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading dishes:', error);
            showLoading(false);
            document.getElementById('dishes-container').innerHTML = '<p>Error loading dishes. Please try again.</p>';
        });
}

function loadDishesByCategory(category) {
    showLoading(true);
    fetch(API_CATEGORY_URL + category)
        .then(response => response.json())
        .then(data => {
            allDishes = data;
            applyFilters();
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading dishes:', error);
            showLoading(false);
        });
}

function applyFilters() {
    let filtered = [...allDishes];

    const spiciness = document.getElementById('spiciness-filter').value;
    const hasNuts = document.getElementById('nuts-filter').value;
    const isVegetarian = document.getElementById('vegetarian-filter').value;

    if (spiciness !== '') {
        filtered = filtered.filter(dish => dish.spiciness === parseInt(spiciness));
    }

    if (hasNuts !== '') {
        filtered = filtered.filter(dish => dish.hasNuts === (hasNuts === 'true'));
    }

    if (isVegetarian !== '') {
        filtered = filtered.filter(dish => dish.isVegetarian === (isVegetarian === 'true'));
    }

    displayDishes(filtered);
}

function displayDishes(dishes) {
    const container = document.getElementById('dishes-container');
    const countEl = document.getElementById('dishes-count');

    countEl.textContent = dishes.length + ' dishes found';

    if (dishes.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No dishes found matching your filters.</p>';
        return;
    }

    container.innerHTML = '';
    dishes.forEach(dish => {
        const card = createDishCard(dish);
        container.appendChild(card);
    });
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';

    const spicyIcons = '🌶️'.repeat(dish.spiciness);
    const nutsIcon = dish.hasNuts ? '🥜' : '';
    const vegetarianIcon = dish.isVegetarian ? '🌱' : '';

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-image" onerror="this.src='https://via.placeholder.com/250x200?text=No+Image'">
        <div class="dish-info">
            <div class="dish-name">${dish.name}</div>
            <div class="dish-details">
                <span class="spiciness">${spicyIcons || 'No spice'}</span>
                <span>${nutsIcon}</span>
                <span>${vegetarianIcon}</span>
            </div>
            <div class="dish-price">$${dish.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${dish.id})">Add to Cart</button>
        </div>
    `;

    return card;
}

function addToCart(dishId) {
    const dish = allDishes.find(d => d.id === dishId);
    if (!dish) return;

    const existingItem = cart.find(item => item.id === dishId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification('Added to cart!');
}

function removeFromCart(dishId) {
    cart = cart.filter(item => item.id !== dishId);
    saveCart();
    updateCartUI();
    displayCart();
}

function updateQuantity(dishId, change) {
    const item = cart.find(item => item.id === dishId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(dishId);
    } else {
        saveCart();
        updateCartUI();
        displayCart();
    }
}

function displayCart() {
    const container = document.getElementById('cart-container');
    const emptyEl = document.getElementById('cart-empty');
    const summaryEl = document.getElementById('cart-summary');

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyEl.style.display = 'block';
        summaryEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    summaryEl.style.display = 'block';

    container.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('restaurantCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function showMenuPage() {
    document.getElementById('menu-page').style.display = 'block';
    document.getElementById('cart-page').style.display = 'none';
    document.getElementById('menu-btn').classList.add('active');
    document.getElementById('cart-btn').classList.remove('active');
}

function showCartPage() {
    document.getElementById('menu-page').style.display = 'none';
    document.getElementById('cart-page').style.display = 'block';
    document.getElementById('menu-btn').classList.remove('active');
    document.getElementById('cart-btn').classList.add('active');
    displayCart();
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    document.getElementById('dishes-container').style.display = show ? 'none' : 'grid';
    document.getElementById('dishes-count').style.display = show ? 'none' : 'block';
}

function resetFilters() {
    document.getElementById('spiciness-filter').value = '';
    document.getElementById('nuts-filter').value = '';
    document.getElementById('vegetarian-filter').value = '';

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });

    currentCategory = 'all';
    loadDishes();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
