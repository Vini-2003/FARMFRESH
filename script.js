function updatePrice(selectElement, priceElementId) 
{
    const selectedPrice = selectElement.value; 
    const priceElement = document.getElementById(priceElementId); 
    priceElement.textContent = `Price: ₹${selectedPrice}`;
}

if (!localStorage.getItem('cart')) 
{
    localStorage.setItem('cart', JSON.stringify({}));
}

function addToCart(productName, weightDropdownId) 
{
    const dropdown = document.getElementById(weightDropdownId);
    const weight = dropdown.options[dropdown.selectedIndex].text.split(' ')[0];
    const price = dropdown.options[dropdown.selectedIndex].value;

    const cart = JSON.parse(localStorage.getItem('cart'));

    // Create or update the cart entry for the product
    const key = `${productName} - ${weight}`;
    if (cart[key]) 
    {
        cart[key].quantity += 1;
    }
    else 
    {
        cart[key] = {
            price: price,
            weight: weight,
            quantity: 1,
        };
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} (${weight}) added to cart!`);
}


function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');

    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || Object.keys(cart).length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        totalPriceElement.textContent = '';
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
            </tr>
        `;
    }

    tableHTML += '</table>';
    cartContainer.innerHTML = tableHTML;
    totalPriceElement.textContent = `Total Price: ₹${totalPrice}`;
}

function updateCart(productName, action) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart[productName]) 
        return;

    if (action === 'increase') 
    {
        cart[productName].quantity += 1;
    } 
    else if (action === 'decrease') 
    {
        cart[productName].quantity -= 1;
        if (cart[productName].quantity <= 0) 
        {
            delete cart[productName];
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Load the cart when the page is loaded
window.onload = loadCart;
