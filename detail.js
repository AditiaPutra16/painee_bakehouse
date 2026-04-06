/* ========================================================
   product-detail.js — All-in-one (CSS + JS)
   Cara pakai: cukup tambahkan SATU baris sebelum </body>
   <script src="product-detail.js"></script>
======================================================== */

(function () {
  /* ===== INJECT CSS ===== */
  const style = document.createElement("style");
  style.textContent = `
    .card-desc {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 4.5em;
    }
    .card-detail-link {
      display: inline-block;
      margin-top: 6px;
      font-size: 0.76rem; font-weight: 500;
      color: var(--maroon);
      letter-spacing: 0.06em;
      cursor: pointer;
      border: none; background: none; padding: 0;
      font-family: 'Jost', sans-serif;
      transition: opacity 0.2s;
    }
    .card-detail-link:hover { opacity: 0.7; }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(42,26,26,0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .modal-overlay.open { opacity: 1; pointer-events: all; }

    .modal-box {
      background: var(--cream);
      border-radius: 28px;
      overflow: hidden;
      max-width: 520px; width: 100%;
      box-shadow: 0 24px 80px rgba(123,0,0,0.25);
      transform: translateY(24px) scale(0.97);
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
      max-height: 90vh; overflow-y: auto;
      position: relative;
    }
    .modal-overlay.open .modal-box { transform: translateY(0) scale(1); }

    .modal-img { width: 100%; height: 260px; object-fit: cover; display: block; }

    .modal-body { padding: 28px 32px 32px; }

    .modal-cat {
      display: inline-block;
      font-size: 0.65rem; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--maroon);
      background: rgba(123,0,0,0.08);
      padding: 4px 12px; border-radius: 50px;
      margin-bottom: 12px;
    }
    .modal-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.9rem; font-weight: 500;
      color: var(--text-dark);
      line-height: 1.2; margin-bottom: 14px;
    }
    .modal-desc {
      font-size: 0.9rem; font-weight: 300;
      line-height: 1.8; color: var(--text-mid);
      margin-bottom: 24px;
    }
    .modal-footer {
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; padding-top: 20px;
      border-top: 1px solid rgba(123,0,0,0.08);
    }
    .modal-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem; font-weight: 600;
      color: var(--maroon); line-height: 1;
    }
    .modal-price small {
      display: block;
      font-family: 'Jost', sans-serif;
      font-size: 0.72rem; font-weight: 400;
      color: var(--text-light); margin-bottom: 2px;
    }
    .modal-order-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--maroon); color: var(--cream);
      font-family: 'Jost', sans-serif;
      font-size: 0.82rem; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 12px 26px; border-radius: 50px;
      border: none; cursor: pointer;
      transition: all 0.3s ease;
    }
    .modal-order-btn:hover {
      background: var(--maroon-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(123,0,0,0.25);
    }
    .modal-close {
      position: absolute; top: 16px; right: 16px;
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,245,225,0.9);
      backdrop-filter: blur(8px);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; color: var(--maroon);
      transition: all 0.2s; z-index: 10;
    }
    .modal-close:hover { background: var(--cream-dark); transform: scale(1.1); }
  `;
  document.head.appendChild(style);

  /* ===== BUAT MODAL ===== */
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Tutup">✕</button>
      <img class="modal-img" src="" alt="" />
      <div class="modal-body">
        <span class="modal-cat"></span>
        <h2 class="modal-name"></h2>
        <p class="modal-desc"></p>
        <div class="modal-footer">
          <div class="modal-price">
            <small>Start from</small>
            <span class="modal-price-val"></span>
          </div>
          <button class="modal-order-btn">Order Now →</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modalImg = overlay.querySelector(".modal-img");
  const modalCat = overlay.querySelector(".modal-cat");
  const modalName = overlay.querySelector(".modal-name");
  const modalDesc = overlay.querySelector(".modal-desc");
  const modalPriceVal = overlay.querySelector(".modal-price-val");
  const modalOrderBtn = overlay.querySelector(".modal-order-btn");
  const modalClose = overlay.querySelector(".modal-close");

  /* ===== BUKA / TUTUP ===== */
  function openModal(card) {
    const name = card.querySelector(".card-name")?.textContent || "";
    const desc =
      card.querySelector(".card-desc")?.getAttribute("data-full") || "";
    const price =
      card.querySelector(".card-price")?.lastChild?.textContent?.trim() || "";
    const category = card.querySelector(".card-badge-cat")?.textContent || "";
    const img = card.querySelector(".card-img img")?.src || "";

    modalImg.src = img;
    modalImg.alt = name;
    modalCat.textContent = category;
    modalName.textContent = name;
    modalDesc.textContent = desc;
    modalPriceVal.textContent = price;

    modalOrderBtn.onclick = () => {
      const msg = encodeURIComponent(
        `Halo Painee Cheesecake! Saya mau order *${name}*. Bisa minta info stok dan harga? 😊`
      );
      window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
    };

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ===== INJECT TOMBOL KE SETIAP CARD ===== */
  document.querySelectorAll(".product-card").forEach((card) => {
    const descEl = card.querySelector(".card-desc");
    if (!descEl) return;

    descEl.setAttribute("data-full", descEl.textContent.trim());

    const btn = document.createElement("button");
    btn.className = "card-detail-link";
    btn.textContent = "Selengkapnya →";
    btn.addEventListener("click", () => openModal(card));
    descEl.insertAdjacentElement("afterend", btn);
  });
})();
