// Elementos de HTML
const products = document.querySelector(".products-container");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const categories = document.querySelector(".categories-container");
const categoriesList = document.querySelectorAll(".category");
const btnLoad = document.querySelector(".btn-verMas");
const buyBtn = document.querySelector(".btn-buy");
const cartBtn = document.querySelector(".cart-label");
const barsBtn = document.querySelector(".menu-label");
const cartMenu = document.querySelector(".cart");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const deleteBtn = document.querySelector(".btn-delete");
const succesModal = document.querySelector(".add-modal");

// localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const saveLocalStorage = (boardgameList) => {
  localStorage.setItem("carrito", JSON.stringify(boardgameList));
};

// logica de filtro de productos
const renderProduct = (product) => {
  const {
    id,
    nombre,
    precio,
    minJugadores,
    maxJugadores,
    imgSrc,
    tiempo,
    edad,
  } = product;
  return `
  <div class="boardgame-card">
    <div class="title-bg">
      <img src=${imgSrc} class="boardgame-img"/>
      <h3 class="title">${nombre}</h3>
    </div>
    <div class="info-bg">
      <div class="info-l">
        <p><i class="fa-solid fa-user"></i> ${minJugadores}-${maxJugadores} jugadores</p>
        <p><i class="fa-solid fa-clock"></i> ${tiempo} min</p>
        <p><i class="fa-solid fa-children"></i> ${edad}+ años</p>
      </div>
      <div class="info-r">
        <span class="precio">$${precio}</span>
        <button class="btn-add"
        data-id="${id}"
        data-nombre="${nombre}"
        data-precio="${precio}"
        data-img="${imgSrc}">Comprar
        </button>
      </div>
    </div>
  </div>
  `;
};

const renderDividedProducts = (index = 0) => {
  products.innerHTML += boardgamesController.dividedBoardgames[index]
    .map(renderProduct)
    .join("");
};

const renderFilteredProducts = (category) => {
  const productList = boardgamesData.filter(
    (product) => product.categoria == category
  );

  products.innerHTML = productList.map(renderProduct).join("");
};

const renderProducts = (index = 0, category = undefined) => {
  if (!category) {
    renderDividedProducts(index);
    return;
  }
  renderFilteredProducts(category);
};

// filtrado de categorias
const changeVerMasBtn = (category) => {
  if (!category) {
    btnLoad.classList.remove("hidden");
    return;
  }
  btnLoad.classList.add("hidden");
};

const changeBtnActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
};

const cambiarFiltro = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeBtnActiveState(selectedCategory);
  changeVerMasBtn(selectedCategory);
};

const aplicarFiltro = (e) => {
  if (!e.target.classList.contains("category")) return;
  cambiarFiltro(e);
  if (!e.target.dataset.category) {
    products.innerHTML = "";
    renderProducts();
  } else {
    renderProducts(0, e.target.dataset.category);
    boardgamesController.nextBoardgames = 1;
  }
};

// cargar productos
const isLastIndexOf = () =>
  boardgamesController.nextBoardgames == boardgamesController.boardgamesLimit;

const VerMasProductos = () => {
  renderProducts(boardgamesController.nextBoardgames);
  boardgamesController.nextBoardgames++;
  if (isLastIndexOf()) {
    btnLoad.classList.add("hidden");
  }
};

// Menu y carrito
const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) return;
  barsMenu.classList.remove("open-menu");
};

// *carrito
const renderCartProduct = (cartProduct) => {
  const { id, nombre, precio, imgSrc, quantity } = cartProduct;
  return `
  <div class="item-carrito">
    <img src=${imgSrc} alt="producto" class="img-carro"/>
    <div class="item-info">
      <h3 class="item-title">${nombre}</h3>
      <p>Precio:</p>
      <p class="item-precio">$${precio}</p>
    </div>
    <div class="item-cantidades">
      <span class="manejo-cantidad menos" data-id="${id}">-</span>
      <span class="cantidad-item">${quantity}</span>
      <span class="manejo-cantidad mas" data-id="${id}">+</span>
    </div>
  </div>`;
};

const renderCart = () => {
  if (!carrito.length) {
    productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito</p>`;
    return;
  }
  productsCart.innerHTML = carrito.map(renderCartProduct).join("");
};

const totalCarro = () => {
  return carrito.reduce(
    (acu, act) => acu + Number(act.precio) * act.quantity,
    0
  );
};

const verTotal = () => {
  total.innerHTML = `$ ${totalCarro()}`;
};

const disableBtn = (btn) => {
  if (!carrito.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const createProductData = (id, nombre, precio, imgSrc) => {
  return { id, nombre, precio, imgSrc };
};

const existeElProducto = (product) => {
  return carrito.find((item) => item.id === product.id);
};

const addUnitToProduct = (product) => {
  carrito = carrito.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

const creaProducto = (product) => {
  carrito = [...carrito, { ...product, quantity: 1 }];
};

const mostrarModal = (msg) => {
  succesModal.classList.add("active-modal");
  succesModal.textContent = msg;
  setTimeout(() => {
    succesModal.classList.remove("active-modal");
  }, 1500);
};

const estadoCarro = () => {
  saveLocalStorage(carrito);
  renderCart(carrito);
  verTotal(carrito);
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

const addProduct = (e) => {
  if (!e.target.classList.contains("btn-add")) return;
  const { id, nombre, precio, imgSrc } = e.target.dataset;
  const product = createProductData(id, nombre, precio, imgSrc);

  if (existeElProducto(product)) {
    addUnitToProduct(product);
    mostrarModal("Sumaste una unidad del producto al carrito");
  } else {
    creaProducto(product);
    mostrarModal("El producto se agregó al carrito");
  }
  estadoCarro();
};

const eliminaProductoCarro = (productoExistente) => {
  carrito = carrito.filter((product) => product.id !== productoExistente.id);
  estadoCarro();
};

const restarUnidadProducto = (productoExistente) => {
  carrito = carrito.map((product) => {
    return product.id === productoExistente.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const manejoBtnMenos = (id) => {
  const productoExistente = carrito.find((item) => item.id === id);
  if (productoExistente.quantity === 1) {
    if (window.confirm("Queres eliminar el producto del carrito?")) {
      eliminaProductoCarro(productoExistente);
    }
    return;
  }
  restarUnidadProducto(productoExistente);
};

const manejoBtnMas = (id) => {
  const productoExistente = carrito.find((item) => item.id === id);
  addUnitToProduct(productoExistente);
};

const manejarCantidades = (e) => {
  if (e.target.classList.contains("menos")) {
    manejoBtnMenos(e.target.dataset.id);
  } else if (e.target.classList.contains("mas")) {
    manejoBtnMas(e.target.dataset.id);
  }
  estadoCarro();
};

const resetItemCarrito = () => {
  carrito = [];
  estadoCarro();
};

const accionCarrito = (confirmMsg, succesMsg) => {
  if (!carrito.length) return;
  if (window.confirm(confirmMsg)) {
    resetItemCarrito();
    alert(succesMsg);
  }
};

const completarCompra = () => {
  accionCarrito("Querés realizar tu compra?", "Gracias por la compra!");
};

const vaciarCarrito = () => {
  accionCarrito("Queres vaciar el carrito?", "No hay productos en el carrito");
};

// Funcion inicializadora
const init = () => {
  renderProducts();
  categories.addEventListener("click", aplicarFiltro);
  btnLoad.addEventListener("click", VerMasProductos);
  cartBtn.addEventListener("click", toggleCart);
  barsBtn.addEventListener("click", toggleMenu);
  barsMenu.addEventListener("click", closeOnClick);
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", verTotal);
  disableBtn(deleteBtn);
  disableBtn(buyBtn);
  products.addEventListener("click", addProduct);
  productsCart.addEventListener("click", manejarCantidades);
  buyBtn.addEventListener("click", completarCompra);
  deleteBtn.addEventListener("click", vaciarCarrito);
};

init();
