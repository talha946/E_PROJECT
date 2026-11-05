// BrightWorld cart: shared across pages using localStorage
(() => {
  const CART_KEY = "brightworld_cart";
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  };
  const saveCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  };
  const updateCartBadge = () => {
    const count = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  };
  const showToast = message => {
    let toast = document.querySelector(".cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "cart-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const addProduct = (product, quantity) => {
    const cart = readCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });
    saveCart(cart);
    showToast(`${product.name} added to cart`);
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Add cart shortcut to every page header.
    const nav = document.querySelector(".navbar nav ul");
    if (nav && !document.querySelector(".cart-nav-link")) {
      const li = document.createElement("li");
      li.innerHTML = `<a class="cart-nav-link" href="cart.html" aria-label="Shopping cart">
        <svg class="cart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
          <circle cx="10" cy="19.5" r="1.4" />
          <circle cx="18" cy="19.5" r="1.4" />
        </svg>
        <span class="cart-count">0</span>
      </a>`;
      nav.appendChild(li);
    }
    updateCartBadge();

    // Connect every product modal's Add To Cart button with its product card.
    document.querySelectorAll(".modal").forEach(modal => {
      const button = [...modal.querySelectorAll("a,button")].find(el => el.textContent.trim().toLowerCase() === "add to cart");
      if (!button) return;
      button.href = "#";
      button.addEventListener("click", event => {
        event.preventDefault();
        const id = `${location.pathname.split("/").pop() || "home"}-${modal.id}`;
        const heading = modal.querySelector("h1,h2,h3,h4");
        const priceText = [...modal.querySelectorAll("h4,p,strong")].map(el => el.textContent).join(" ");
        const priceMatch = priceText.match(/(?:Price\s*:\s*)?\$\s*(\d+(?:\.\d{1,2})?)/i);
        const card = document.querySelector(`[data-target="#${modal.id}"]`);
        const image = card?.querySelector("img")?.getAttribute("src") || "";
        const quantitySelect = modal.querySelector("select");
        const quantity = Math.max(1, Number(quantitySelect?.value || 1));
        addProduct({
          id,
          name: heading?.textContent.trim() || "BrightWorld Product",
          price: priceMatch ? Number(priceMatch[1]) : 0,
          image
        }, quantity);
      });
    });

    // Render the cart page when present.
    const cartRoot = document.getElementById("cart-page");
    if (cartRoot) renderCart(cartRoot);
  });

  function renderCart(root) {
    const cart = readCart();
    if (!cart.length) {
      root.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><h2>Your cart is empty</h2><p>Looks like you haven't added any products yet.</p><a class="btn" href="product.html">Continue Shopping</a></div>`;
      return;
    }
    const money = value => `$${Number(value).toFixed(2)}`;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">
          ${cart.map(item => `
            <article class="cart-item" data-id="${escapeHtml(item.id)}">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'">
              <div class="cart-item-info">
                <h3>${escapeHtml(item.name)}</h3>
                <p class="cart-unit-price">${money(item.price)} each</p>
                <button class="remove-item" type="button" data-remove="${escapeHtml(item.id)}">Remove</button>
              </div>
              <div class="cart-quantity">
                <label>Qty</label>
                <input type="number" min="1" max="99" value="${item.quantity}" data-quantity="${escapeHtml(item.id)}">
              </div>
              <strong class="cart-line-total">${money(item.price * item.quantity)}</strong>
            </article>`).join("")}
        </div>
        <aside class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="summary-row"><span>Delivery</span><span>Calculated at checkout</span></div>
          <hr>
          <div class="summary-row total"><span>Total</span><strong>${money(subtotal)}</strong></div>
          <a class="btn checkout-btn" href="checkout.html">Proceed to Payment</a>
          <a class="continue-link" href="product.html">Continue Shopping</a>
          
        </aside>
      </div>`;
    root.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
      saveCart(readCart().filter(item => item.id !== button.dataset.remove));
      renderCart(root);
    }));
    root.querySelectorAll("[data-quantity]").forEach(input => input.addEventListener("change", () => {
      const quantity = Math.max(1, Math.min(99, Number(input.value) || 1));
      const updated = readCart().map(item => item.id === input.dataset.quantity ? { ...item, quantity } : item);
      saveCart(updated);
      renderCart(root);
    }));
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[char]));
  }
})();