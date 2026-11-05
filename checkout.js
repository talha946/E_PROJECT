(() => {
  const KEY = "brightworld_cart";
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  };
  const money = n => `$${Number(n).toFixed(2)}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("checkout-content");
    const cart = readCart();
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
    if (!cart.length) {
      root.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><h2>Your cart is empty</h2><p>Add some products before checkout.</p><a class="btn" href="product.html">Continue Shopping</a></div>`;
      return;
    }
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    root.innerHTML = `
      <div class="payment-layout">
        <section class="payment-card">
          <h2>Payment Method</h2>
          <label class="payment-option">
            <input type="radio" name="payment-method" value="card" checked>
            <span class="payment-symbol">▣</span>
            <span><strong>Card Payment</strong><small>Credit or debit card</small></span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment-method" value="cod">
            <span class="payment-symbol">৳</span>
            <span><strong>Cash on Delivery</strong><small>Pay when your order is delivered</small></span>
          </label>
          <button class="btn place-order-btn" id="place-order" type="button">Pay Now</button>
          <a class="continue-link" href="cart.html">Back to Cart</a>
        </section>
        <aside class="payment-card order-card">
          <h2>Order Summary</h2>
          ${cart.map(item => `<div class="payment-product"><span>${escapeHtml(item.name)} × ${Number(item.quantity)}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")}
          <hr><div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>
        </aside>
      </div>`;

    document.getElementById("place-order")?.addEventListener("click", () => {
      const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
      const methodLabel = selectedMethod === "cod" ? "Cash on Delivery" : "Card Payment";
      const orderNumber = "BW" + Date.now().toString().slice(-7);

      localStorage.removeItem(KEY);
      document.querySelectorAll(".cart-count").forEach(el => el.textContent = "0");

      root.innerHTML = `
        <section class="order-success">
          <div class="success-mark" aria-hidden="true">✓</div>
          <h2>Thank You for Your Order!</h2>
          <p class="order-success-message">Your order has been placed successfully.</p>
          <div class="success-details"><span>Order Number</span><strong>${orderNumber}</strong></div>
          <div class="success-details"><span>Payment Method</span><strong>${methodLabel}</strong></div>
          <div class="success-details"><span>Order Total</span><strong>${money(total)}</strong></div>
          <p class="order-thanks-note">We appreciate your purchase at BrightWorld.</p>
          <a class="btn" href="index.html">Continue Shopping</a>
        </section>`;
    });
  });
})();