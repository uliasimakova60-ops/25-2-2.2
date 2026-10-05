"use strict";

/*
  LumiCare — учебный интернет-магазин.
  В реальном проекте клиентская проверка должна дополняться серверной валидацией,
  защитой от CSRF, XSS, спама и безопасной обработкой персональных данных.
*/

// Данные товаров: карточки каталога формируются через DOM API.
const products = [
  {
    id: 1,
    name: "Баланс-шампунь Green Balance",
    category: "hair",
    tags: ["hair", "cleansing"],
    categoryLabel: "Для волос · Очищение",
    description: "Мягко очищает кожу головы, сохраняя естественный баланс и свежесть.",
    volume: "300 мл",
    price: 890,
    rating: 4.9,
    badge: "Хит",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Кондиционер Silk Leaf",
    category: "hair",
    tags: ["hair", "moisturizing", "restoration"],
    categoryLabel: "Для волос · Увлажнение",
    description: "Смягчает длину, облегчает расчёсывание и придаёт естественный блеск.",
    volume: "250 мл",
    price: 940,
    rating: 4.8,
    badge: "Выбор покупателей",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Маска для волос Deep Repair",
    category: "hair",
    tags: ["hair", "moisturizing", "restoration"],
    categoryLabel: "Для волос · Восстановление",
    description: "Питательная формула с маслами ши и макадамии для сухих волос.",
    volume: "200 мл",
    price: 1190,
    rating: 5.0,
    badge: "Новинка",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Сыворотка для волос Shine Drop",
    category: "hair",
    tags: ["hair", "protection", "restoration"],
    categoryLabel: "Для волос · Защита",
    description: "Несмываемый уход против пушистости с лёгким термозащитным эффектом.",
    volume: "50 мл",
    price: 1050,
    rating: 4.7,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Крем для лица Daily Comfort",
    category: "face",
    tags: ["face", "moisturizing", "protection"],
    categoryLabel: "Для лица · Увлажнение",
    description: "Комфортный дневной крем с церамидами для укрепления защитного барьера.",
    volume: "50 мл",
    price: 1290,
    rating: 4.9,
    badge: "Хит",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Очищающий гель Soft Cloud",
    category: "face",
    tags: ["face", "cleansing"],
    categoryLabel: "Для лица · Очищение",
    description: "Удаляет загрязнения и макияж без ощущения сухости и стянутости.",
    volume: "150 мл",
    price: 790,
    rating: 4.8,
    badge: "Мягкая формула",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Тоник Calm Dew",
    category: "face",
    tags: ["face", "moisturizing"],
    categoryLabel: "Для лица · Тонизация",
    description: "Освежает кожу после очищения и подготавливает её к основному уходу.",
    volume: "200 мл",
    price: 720,
    rating: 4.6,
    badge: "Без спирта",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Увлажняющая сыворотка Aqua Bloom",
    category: "face",
    tags: ["face", "moisturizing", "restoration"],
    categoryLabel: "Для лица · Увлажнение",
    description: "Гиалуроновая кислота и алоэ помогают поддерживать гладкость и сияние.",
    volume: "30 мл",
    price: 1390,
    rating: 5.0,
    badge: "Топ продаж",
    image: "https://images.unsplash.com/photo-1629198726018-604230bdb091?auto=format&fit=crop&w=800&q=80"
  }
];

const productGrid = document.querySelector("#productGrid");
const catalogStatus = document.querySelector("#catalogStatus");
const productSearch = document.querySelector("#productSearch");
const filterButtons = document.querySelector("#filterButtons");
const cartCount = document.querySelector("#cartCount");
const cartModal = document.querySelector("#cartModal");
const cartContent = document.querySelector("#cartContent");
const cartSummary = document.querySelector("#cartSummary");
const cartTotal = document.querySelector("#cartTotal");
const checkoutForm = document.querySelector("#checkoutForm");
const toastContainer = document.querySelector("#toastContainer");
const imageFallback = createImageFallback();

let activeFilter = "all";
let cart = loadCart();
let lastFocusedElement = null;

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function createImageFallback() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#f8f2e9"/>
    <circle cx="400" cy="280" r="180" fill="#e6eee4"/>
    <rect x="315" y="160" width="170" height="300" rx="45" fill="#ffffff" stroke="#6f8f72" stroke-width="8"/>
    <rect x="350" y="115" width="100" height="65" rx="12" fill="#3f6548"/>
    <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#3f6548">LUMI</text>
    <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#68726b">CARE</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function attachImageFallback(image) {
  image.addEventListener("error", () => {
    if (image.src !== imageFallback) image.src = imageFallback;
  }, { once: true });
}

// Безопасное создание карточек: текстовые данные добавляются через textContent.
function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card reveal is-visible";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  image.width = 800;
  image.height = 600;
  attachImageFallback(image);

  const badge = document.createElement("span");
  badge.className = "product-badge";
  badge.textContent = product.badge;
  imageWrap.append(image, badge);

  const body = document.createElement("div");
  body.className = "product-body";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.categoryLabel;

  const title = document.createElement("h3");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const meta = document.createElement("div");
  meta.className = "product-meta";
  const volume = document.createElement("span");
  volume.textContent = product.volume;
  const rating = document.createElement("span");
  rating.className = "rating";
  rating.setAttribute("aria-label", `Рейтинг ${product.rating} из 5`);
  rating.textContent = `★ ${product.rating}`;
  meta.append(volume, rating);

  const footer = document.createElement("div");
  footer.className = "product-footer";
  const price = document.createElement("strong");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);
  const addButton = document.createElement("button");
  addButton.className = "button button-primary add-button";
  addButton.type = "button";
  addButton.dataset.productId = String(product.id);
  addButton.textContent = "В корзину";
  addButton.setAttribute("aria-label", `Добавить ${product.name} в корзину`);
  footer.append(price, addButton);

  body.append(category, title, description, meta, footer);
  article.append(imageWrap, body);
  return article;
}

function renderProducts() {
  const query = productSearch.value.trim().toLocaleLowerCase("ru-RU");
  const filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.tags.includes(activeFilter);
    const matchesSearch = product.name.toLocaleLowerCase("ru-RU").includes(query);
    return matchesFilter && matchesSearch;
  });

  productGrid.replaceChildren();
  filteredProducts.forEach((product) => productGrid.append(createProductCard(product)));

  if (filteredProducts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-catalog";
    const title = document.createElement("h3");
    title.textContent = "Ничего не найдено";
    const text = document.createElement("p");
    text.textContent = "Измените поисковый запрос или выберите другой фильтр.";
    empty.append(title, text);
    productGrid.append(empty);
  }
  catalogStatus.textContent = `Найдено товаров: ${filteredProducts.length}`;
}

filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filterButtons.querySelectorAll("[data-filter]").forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

productSearch.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  addToCart(Number(button.dataset.productId));
});

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("lumicareCart") || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart
      .filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && products.some((product) => product.id === item.id))
      .map((item) => ({ id: item.id, quantity: Math.min(item.quantity, 99) }));
  } catch (error) {
    console.warn("Не удалось прочитать корзину из localStorage:", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("lumicareCart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Не удалось сохранить корзину в localStorage:", error);
    showToast("Корзина работает, но не может быть сохранена в браузере.", "error");
  }
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) cartItem.quantity = Math.min(cartItem.quantity + 1, 99);
  else cart.push({ id: productId, quantity: 1 });
  saveCart();
  updateCartUI();
  showToast(`${product.name} добавлен в корзину`);
}

function updateCartUI() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(totalQuantity);
  const cartButton = document.querySelector("#cartOpenButton");
  cartButton.setAttribute("aria-label", `Открыть корзину, товаров: ${totalQuantity}`);
  renderCart();
}

function createCartItem(cartItem) {
  const product = products.find((item) => item.id === cartItem.id);
  const wrapper = document.createElement("article");
  wrapper.className = "cart-item";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.width = 74;
  image.height = 74;
  attachImageFallback(image);

  const info = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = product.name;
  const unitPrice = document.createElement("p");
  unitPrice.className = "cart-item-price";
  unitPrice.textContent = `${formatPrice(product.price)} за шт.`;

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";
  const decrease = document.createElement("button");
  decrease.className = "quantity-button";
  decrease.type = "button";
  decrease.dataset.action = "decrease";
  decrease.dataset.id = String(product.id);
  decrease.textContent = "−";
  decrease.setAttribute("aria-label", `Уменьшить количество ${product.name}`);
  const quantity = document.createElement("span");
  quantity.textContent = String(cartItem.quantity);
  quantity.setAttribute("aria-label", `Количество: ${cartItem.quantity}`);
  const increase = document.createElement("button");
  increase.className = "quantity-button";
  increase.type = "button";
  increase.dataset.action = "increase";
  increase.dataset.id = String(product.id);
  increase.textContent = "+";
  increase.setAttribute("aria-label", `Увеличить количество ${product.name}`);
  const remove = document.createElement("button");
  remove.className = "remove-button";
  remove.type = "button";
  remove.dataset.action = "remove";
  remove.dataset.id = String(product.id);
  remove.textContent = "Удалить";
  remove.setAttribute("aria-label", `Удалить ${product.name} из корзины`);
  controls.append(decrease, quantity, increase, remove);
  info.append(title, unitPrice, controls);

  const lineTotal = document.createElement("strong");
  lineTotal.className = "cart-line-total";
  lineTotal.textContent = formatPrice(product.price * cartItem.quantity);
  wrapper.append(image, info, lineTotal);
  return wrapper;
}

function renderCart() {
  cartContent.replaceChildren();
  checkoutForm.hidden = true;
  cartSummary.hidden = cart.length === 0;

  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🛍";
    const title = document.createElement("h3");
    title.textContent = "Корзина пока пуста";
    const text = document.createElement("p");
    text.textContent = "Добавьте средства из каталога — они появятся здесь.";
    const link = document.createElement("button");
    link.className = "button button-primary";
    link.type = "button";
    link.textContent = "Перейти в каталог";
    link.addEventListener("click", () => {
      closeModal(cartModal);
      document.querySelector("#catalog").scrollIntoView({ behavior: getScrollBehavior() });
    });
    empty.append(icon, title, text, link);
    cartContent.append(empty);
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cart.forEach((item) => cartContent.append(createCartItem(item)));
  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);
  cartTotal.textContent = formatPrice(total);
}

cartContent.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const id = Number(control.dataset.id);
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  if (control.dataset.action === "increase") item.quantity = Math.min(item.quantity + 1, 99);
  if (control.dataset.action === "decrease") item.quantity -= 1;
  if (control.dataset.action === "remove" || item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart();
  updateCartUI();
});

document.querySelector("#clearCartButton").addEventListener("click", () => {
  if (cart.length === 0) return;
  if (window.confirm("Очистить корзину?")) {
    cart = [];
    saveCart();
    updateCartUI();
    showToast("Корзина очищена");
  }
});

// Универсальное управление модальными окнами и возвратом фокуса.
function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const panel = modal.querySelector(".modal-panel");
  window.requestAnimationFrame(() => panel.focus());
}

function closeModal(modal) {
  modal.hidden = true;
  if (!document.querySelector(".modal:not([hidden])")) document.body.classList.remove("modal-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

document.querySelector("#cartOpenButton").addEventListener("click", () => {
  renderCart();
  openModal(cartModal);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    if (modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openModalElement = document.querySelector(".modal:not([hidden])");
  if (openModalElement) closeModal(openModalElement);
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) return;
  cartContent.hidden = true;
  cartSummary.hidden = true;
  checkoutForm.hidden = false;
  document.querySelector("#orderName").focus();
});

document.querySelector("#backToCartButton").addEventListener("click", () => {
  checkoutForm.hidden = true;
  cartContent.hidden = false;
  cartSummary.hidden = false;
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const validName = validateTextField(document.querySelector("#orderName"), 2, "Введите имя (не менее 2 символов).");
  const validPhone = validatePhoneField(document.querySelector("#orderPhone"), true);
  const validEmail = validateEmailField(document.querySelector("#orderEmail"));
  if (!validName || !validPhone || !validEmail) return;

  cart = [];
  saveCart();
  updateCartUI();
  checkoutForm.reset();
  cartContent.hidden = false;
  closeModal(cartModal);
  showToast("Заказ успешно оформлен. Это демонстрационная версия интернет-магазина.");
});

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.textContent = message;
  toastContainer.append(toast);
  window.setTimeout(() => {
    toast.classList.add("hide");
    window.setTimeout(() => toast.remove(), 260);
  }, 3600);
}

// Мобильное меню.
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
}

menuToggle.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("open");
  mainNav.classList.toggle("open", willOpen);
  menuToggle.classList.toggle("active", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Закрыть меню" : "Открыть меню");
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1050) closeMenu();
});

// Плавная прокрутка для внутренних ссылок с учётом настроек пользователя.
function getScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
});

// Категории переводят пользователя к отфильтрованному каталогу.
document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.category;
    productSearch.value = "";
    filterButtons.querySelectorAll("[data-filter]").forEach((filterButton) => {
      const isActive = filterButton.dataset.filter === activeFilter;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
    document.querySelector("#catalog").scrollIntoView({ behavior: getScrollBehavior() });
  });
});

// Динамические поля формы подбора ухода.
const careOptions = {
  hair: {
    types: [
      ["normal", "Нормальные волосы"], ["dry", "Сухие и пористые"], ["oily", "Жирные у корней"], ["colored", "Окрашенные"]
    ],
    problems: [
      ["dryness", "Сухость и ломкость"], ["volume", "Недостаток объёма"], ["frizz", "Пушистость"], ["damage", "Повреждение"]
    ]
  },
  face: {
    types: [
      ["normal", "Нормальная кожа"], ["dry", "Сухая"], ["oily", "Жирная"], ["combination", "Комбинированная"], ["sensitive", "Чувствительная"]
    ],
    problems: [
      ["dehydration", "Обезвоженность"], ["sensitivity", "Чувствительность"], ["dullness", "Тусклый тон"], ["imperfections", "Несовершенства"]
    ]
  }
};

const careDirection = document.querySelector("#careDirection");
const careType = document.querySelector("#careType");
const careProblem = document.querySelector("#careProblem");
const careResult = document.querySelector("#careResult");

function fillSelect(select, options, placeholder) {
  select.replaceChildren();
  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = placeholder;
  select.append(firstOption);
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
  select.disabled = false;
}

careDirection.addEventListener("change", () => {
  const config = careOptions[careDirection.value];
  careResult.hidden = true;
  if (!config) {
    fillSelect(careType, [], "Сначала выберите направление");
    fillSelect(careProblem, [], "Сначала выберите направление");
    careType.disabled = true;
    careProblem.disabled = true;
    return;
  }
  fillSelect(careType, config.types, "Выберите тип");
  fillSelect(careProblem, config.problems, "Выберите проблему");
});

function setSelectValidation(select, errorElement, message) {
  const valid = Boolean(select.value);
  select.classList.toggle("invalid", !valid);
  select.setAttribute("aria-invalid", String(!valid));
  errorElement.textContent = valid ? "" : message;
  return valid;
}

document.querySelector("#careForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const directionValid = setSelectValidation(careDirection, document.querySelector("#directionError"), "Выберите направление ухода.");
  const typeValid = setSelectValidation(careType, document.querySelector("#typeError"), "Укажите тип волос или кожи.");
  const problemValid = setSelectValidation(careProblem, document.querySelector("#problemError"), "Выберите основную проблему.");
  if (!directionValid || !typeValid || !problemValid) return;

  const isHair = careDirection.value === "hair";
  const problemRecommendations = {
    dryness: "Добавьте питательную маску Deep Repair 1–2 раза в неделю и наносите кондиционер только на длину.",
    volume: "Выбирайте лёгкий шампунь Green Balance и не перегружайте прикорневую зону плотными средствами.",
    frizz: "После мытья используйте кондиционер Silk Leaf и 1–2 капли сыворотки Shine Drop на влажную длину.",
    damage: "Сочетайте мягкое очищение с маской Deep Repair и защищайте волосы сывороткой перед укладкой.",
    dehydration: "После мягкого очищения нанесите тоник Calm Dew, сыворотку Aqua Bloom и крем Daily Comfort.",
    sensitivity: "Выбирайте минималистичный уход: Soft Cloud, Calm Dew и крем Daily Comfort; вводите продукты по одному.",
    dullness: "Регулярное мягкое очищение и увлажняющая сыворотка Aqua Bloom помогут вернуть более свежий вид.",
    imperfections: "Используйте деликатный гель Soft Cloud, не пересушивайте кожу и поддерживайте увлажнение лёгкой сывороткой."
  };

  careResult.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = isHair ? "Рекомендация для ваших волос" : "Рекомендация для вашей кожи";
  const text = document.createElement("p");
  text.textContent = problemRecommendations[careProblem.value];
  careResult.append(title, text);
  careResult.hidden = false;
  careResult.focus();
});

// FAQ: каждый пункт работает независимо, поэтому открытыми могут быть несколько ответов.
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.closest(".faq-item").querySelector(".faq-answer");
    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
  });
});

// Общие функции клиентской валидации.
function showFieldError(field, message) {
  const error = field.closest(".form-group")?.querySelector(".field-error");
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

function validateTextField(field, minLength, message) {
  const valid = field.value.trim().length >= minLength;
  showFieldError(field, valid ? "" : message);
  return valid;
}

function validateEmailField(field) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const valid = emailPattern.test(field.value.trim());
  showFieldError(field, valid ? "" : "Введите корректный адрес электронной почты.");
  return valid;
}

function validatePhoneField(field, required = false) {
  const value = field.value.trim();
  const digitCount = value.replace(/\D/g, "").length;
  const valid = (!required && value === "") || digitCount >= 10;
  showFieldError(field, valid ? "" : "Введите телефон, содержащий не менее 10 цифр.");
  return valid;
}

const contactForm = document.querySelector("#contactForm");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameValid = validateTextField(document.querySelector("#contactName"), 2, "Введите имя (не менее 2 символов).");
  const emailValid = validateEmailField(document.querySelector("#contactEmail"));
  const phoneValid = validatePhoneField(document.querySelector("#contactPhone"));
  const messageValid = validateTextField(document.querySelector("#contactMessage"), 10, "Введите сообщение (не менее 10 символов).");
  const consent = document.querySelector("#contactConsent");
  const consentValid = consent.checked;
  document.querySelector("#consentError").textContent = consentValid ? "" : "Необходимо подтвердить согласие.";
  consent.setAttribute("aria-invalid", String(!consentValid));

  if (!nameValid || !emailValid || !phoneValid || !messageValid || !consentValid) {
    showToast("Проверьте правильность заполнения формы.", "error");
    return;
  }
  contactForm.reset();
  contactForm.querySelectorAll(".invalid").forEach((field) => field.classList.remove("invalid"));
  showToast("Сообщение отправлено. Спасибо! Это учебная демонстрация.");
});

// Информационное модальное окно для юридических ссылок.
const infoModal = document.querySelector("#infoModal");
const infoTitle = document.querySelector("#infoTitle");
const infoContent = document.querySelector("#infoContent");
const infoTexts = {
  privacy: {
    title: "Политика конфиденциальности",
    paragraphs: [
      "Это учебный сайт. Введённые в формы данные не отправляются на сервер и не сохраняются в localStorage.",
      "В реальном интернет-магазине обработка персональных данных выполняется по защищённому соединению HTTPS с согласия пользователя и в соответствии с законодательством."
    ]
  },
  terms: {
    title: "Пользовательское соглашение",
    paragraphs: [
      "LumiCare является демонстрационным проектом и не осуществляет реальную продажу или доставку товаров.",
      "Цены, адрес, контакты, отзывы и сведения о товарах приведены исключительно в учебных целях."
    ]
  }
};

document.querySelectorAll("[data-info]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = infoTexts[button.dataset.info];
    if (!content) return;
    infoTitle.textContent = content.title;
    infoContent.replaceChildren();
    content.paragraphs.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      infoContent.append(paragraph);
    });
    openModal(infoModal);
  });
});

// Кнопка «Наверх» и анимации появления.
const toTop = document.querySelector("#toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: getScrollBehavior() }));

function initRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
  elements.forEach((element) => observer.observe(element));
}

// Начальная настройка страницы.
document.querySelector("#currentYear").textContent = String(new Date().getFullYear());
renderProducts();
updateCartUI();
initRevealAnimation();
