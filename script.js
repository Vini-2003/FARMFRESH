function updatePrice(selectElement, priceElementId) {
    const selectedPrice = selectElement.value;
    const priceElement = document.getElementById(priceElementId);
    priceElement.textContent = "Price: " + selectedPrice;
}

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({}));
}

function addToCart(productName, weightDropdownId) {
    const dropdown = document.getElementById(weightDropdownId);
    const weight = dropdown.options[dropdown.selectedIndex].text.split(' ')[0];
    const price = dropdown.options[dropdown.selectedIndex].value;

    const cart = JSON.parse(localStorage.getItem('cart'));

    // Create or update the cart entry for the product
    const key = `${productName} - ${weight}`;
    if (cart[key]) {
        cart[key].quantity += 1;
    } else {
        cart[key] = {
            price: parseFloat(price),
            weight: weight,
            quantity: 1,
        };
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} (${weight}) added to cart!`);
    loadCart();
}

function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');

    const cart = JSON.parse(localStorage.getItem('cart'));
    cartContainer.innerHTML = ""; // Clear the container

    if (!cart || Object.keys(cart).length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        totalPriceElement.textContent = '';
        document.getElementById("payment-button").style.display = "none"; // Hide payment button
        return;
    }

    let totalPrice = 0;
    let tableHTML = `
        <table>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
            </tr>
    `;

    for (const [productName, productData] of Object.entries(cart)) {
        const productTotal = productData.price * productData.quantity;
        totalPrice += productTotal;

        tableHTML += `
            <tr>
                <td>${productName}</td>
                <td>₹${productData.price}</td>
                <td>${productData.quantity}</td>
                <td>₹${productTotal}</td>
                <td>
                    <button class="cart-btn" onclick="updateCart('${productName}', 'decrease')">-</button>
                    <button class="cart-btn" onclick="updateCart('${productName}', 'increase')">+</button>
                </td>
            </tr>`;
    }

    tableHTML += '</table>';
    cartContainer.innerHTML = tableHTML;
    totalPriceElement.textContent = `Total Price: ₹${totalPrice}`;

    // Show payment button if the cart is not empty
    const paymentButton = document.getElementById("payment-button");
    paymentButton.style.display = "block";
    paymentButton.onclick = handlePayment;
}

function updateCart(productName, action) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart[productName]) return;

    if (action === 'increase') {
        cart[productName].quantity += 1;
    } else if (action === 'decrease') {
        cart[productName].quantity -= 1;
        if (cart[productName].quantity <= 0) {
            delete cart[productName];
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function handlePayment() {
    const totalPriceElement = document.getElementById("total-price");
    const totalPrice = parseFloat(totalPriceElement.textContent.replace(/[^\d.]/g, ""));

    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || Object.keys(cart).length === 0) {
        alert("Your cart is empty. Add items to proceed.");
        return;
    }

    if (totalPrice > 0) {
        // Show payment options
        const paymentOptions = `
            <div id="payment-options-modal" style="position: fixed; top: 20%; left: 50%; transform: translate(-50%, -20%); padding: 20px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                <h3>Select Payment Method</h3>
                <p>Total: ₹${totalPrice.toFixed(2)}</p>
                <button onclick="processPayment('Credit Card')">Credit Card</button>
                <button onclick="processPayment('GPay')">GPay</button>
                <button onclick="processPayment('UPI')">UPI</button>
                <button onclick="closePaymentOptions()">Cancel</button>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", paymentOptions);
    } 
    else {
        alert("Your cart is empty. Add items to proceed.");
    }
}

function processPayment(method) {
    const totalPriceElement = document.getElementById("total-price");
    const totalPrice = parseFloat(totalPriceElement.textContent.replace(/[^\d.]/g, ""));

    alert(`Payment of ₹${totalPrice.toFixed(2)} via ${method} successful! Thank you for your purchase.`);
    localStorage.setItem('cart', JSON.stringify({})); // Clear the cart
    loadCart();
    closePaymentOptions();
}

function closePaymentOptions() {
    const modal = document.getElementById("payment-options-modal");
    if (modal) modal.remove();
}

// Ensure the payment button exists
document.addEventListener("DOMContentLoaded", () => {
    const paymentButton = document.createElement("button");
    paymentButton.id = "payment-button";
    paymentButton.textContent = "Proceed to Payment";
    paymentButton.style.display = "none"; // Initially hidden
    document.body.appendChild(paymentButton);

    loadCart();
});
