const productSection = document.querySelector('.products');
const productContainer = document.querySelector('.products .container');
const catList = document.querySelector('.catNav-links');
const searchInput = document.getElementById('searchInput');
const searchInput2 = document.getElementById('searchInput2');
const searchBtn = document.getElementById('searchBtn');
const cogBtn = document.getElementById('cogBtn');
const modal = document.querySelector('.modal');
const closeModal = document.getElementById('closeModal');
const imgInput = document.getElementById('imgInput');
const imgForm = document.querySelector('.modal-photoContainer');
const cogSearch = document.getElementById('cogSearch');
const heroCover = document.getElementById('heroContainer')
const searchBar = document.getElementById('search-in-results')

searchBtn.addEventListener('click', searchProducts);
searchBtn2.addEventListener('click', searchProducts2);

cogBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

cogBtn2.addEventListener('click', () => {
  modal.style.display = 'flex';
});

async function logEvent(eventName) {
  console.log(eventName)
  try {
    const res = await fetch('/event', {
      method: 'POST', 
      body: JSON.stringify({eventName}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()

  } catch (error) {
    console.error(error)
  }
}

async function getProducts() {
  try {
    const res = await fetch('/products');
    const products = await res.json();
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

async function searchProducts() {  
  const search = searchInput.value;
  const catid = null
  console.log(`search`, search)
  try {
    const res = await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({ search, catid }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const products = await res.json();
    console.log(`products`, products)
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

async function searchProducts2() {  
  const search = searchInput2.value;
  const activecat = document.querySelector('.catNav-links-item.active')
  console.log('activecat: ', activecat)
  let catid
  if (activecat == null) {
    catid = null
  } else {
    catid = activecat.getAttribute('catid')
  }
  console.log('catid: ', catid)
  try {
    const res = await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({ search, catid }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const products = await res.json();
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

async function getByCat(e) {
  const cats = document.querySelectorAll('.catNav-links-item');
  cats.forEach((cat) => cat.classList.remove('active'));
  // productContainer.innerHTML = ''
  
  const catName = e.innerText;
  e.classList.add('active');
  const catid = e.getAttribute('catid')
  const search = searchInput2.value;

  try {
    const res = await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({ catid, search }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const products = await res.json();
    console.log(`products`, products)
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

function buildFakeProducts(products) {
  document.body.style.overflow = 'initial'
  heroCover.style.display = 'none';
  searchBar.style.display = 'block'
  productContainer.innerHTML = '';
  console.log(`products`, products)
  if(products.length === 0){
    console.log(`vacio products`)
    var notFoundContainer = document.createElement("div");
    var notFoundMessage = document.createTextNode("No hubo resultado a tu busqueda, intenta de nuevo.");
    //añade texto al div creado.
    notFoundContainer.appendChild(notFoundMessage);
    return productContainer.appendChild(notFoundContainer);
  }
  products.forEach((product) => {
    const productEl = document.createElement('div');
    productEl.classList.add('products-item');
    productEl.setAttribute('id', product.id);
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('products-item-photo');
    const imgDiv = document.createElement('img');
    imgDiv.src = product.image;
    photoDiv.appendChild(imgDiv);
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('products-item-info');
    const titleEl = document.createElement('h4');
    titleEl.classList.add('products-item-info-title');
    titleEl.innerText = product.title;
    const priceEl = document.createElement('p');
    priceEl.classList.add('products-item-info-price');
    priceEl.innerText = '$' + product.price;

    console.log('shopid', product.shop_id)

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(priceEl);

    productEl.appendChild(photoDiv);
    productEl.appendChild(infoDiv);

    productEl.addEventListener('click', redirectToFakeDetail);

    productContainer.appendChild(productEl);
  });

}
function buildProducts(products) {
  document.body.style.overflow = 'initial'
  heroCover.style.display = 'none';
  searchBar.style.display = 'block'
  productContainer.innerHTML = '';
  console.log(`products`, products)
  if(products.length === 0){
    console.log(`vacio products`)
    var notFoundContainer = document.createElement("div");
    var notFoundMessage = document.createTextNode("No hubo resultado a tu busqueda, intenta de nuevo.");
    //añade texto al div creado.
    notFoundContainer.appendChild(notFoundMessage);
    return productContainer.appendChild(notFoundContainer);
  }
  products.forEach((product) => {
    const productEl = document.createElement('div');
    productEl.classList.add('products-item');
    productEl.setAttribute('id', product.id);
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('products-item-photo');
    const imgDiv = document.createElement('img');
    imgDiv.src = `/static/uploads/${product.image}`;
    photoDiv.appendChild(imgDiv);
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('products-item-info');
    const titleEl = document.createElement('h4');
    titleEl.classList.add('products-item-info-title');
    titleEl.innerText = product.name;
    const priceEl = document.createElement('p');
    priceEl.classList.add('products-item-info-price');
    priceEl.innerText = '$' + product.price;

    console.log('shopid', product.shop_id)
    // console.log('categoryid', product.category_id)

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(priceEl);

    productEl.appendChild(photoDiv);
    productEl.appendChild(infoDiv);

    productEl.addEventListener('click', redirectToDetail);

    productContainer.appendChild(productEl);
  });
}

function redirectToDetail(e) {
  const prodId = e.target.parentElement.parentElement.getAttribute('id');
  document.cookie = 'prodId=' + prodId;
  window.location.href = `products/${prodId}`;
}


function redirectToFakeDetail(e) {
  const prodId = e.target.parentElement.parentElement.getAttribute('id');
  document.cookie = 'prodId=' + prodId;
  window.location.href = `fakeProducts`;
}

imgInput.addEventListener('change', async (e) => {
  e.preventDefault();
  if (imgForm.image.value === '') {
    console.log('is empty');
    return;
  } else {
    try {
      const formdata = new FormData();
      formdata.append('image', imgInput.files[0]);
      const res = await fetch('/upload-cogImage', {
        method: 'POST',
        body: formdata,
      });
      const data = await res.json();
      console.log(`data`, data)
      imgForm.style.backgroundImage = `url('/static/uploads/${data}')`;
    } catch (error) {
      console.error(error);
    }
  }
});


cogSearch.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const formdata = new FormData();
    formdata.append('image', imgInput.files[0]);
    const res = await fetch('/cognitivo');
    const products = await res.json();
    modal.style.display = 'none';
    buildProducts(products);
    console.log('products: ', data);
  } catch (error) {
    console.error(error);
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

//Aqui comienza el js del bot 
var hint = document.getElementById('botsito');
var height = hint.clientHeight;
var width = hint.clientWidth;
console.log(width + 'x' + height);
// initialize them (within hint.style)
hint.style.height = height + 'px';
hint.style.width = width + 'px'


document.getElementById("move-chat").addEventListener("click",function(){
   /* var resultado = document.getElementById("botsito").classList.toggle("mostrar-chat");*/
     
   if(hint.style.visibility == 'hidden'){
    hint.style.visibility = 'visible';
    //hint.style.opacity = '1';
    hint.style.height = height + 'px';
    hint.style.width = width + 'px';
    hint.style.padding = '.5em';
  }
  else{
    hint.style.visibility = 'hidden';
    //hint.style.opacity = '0';
    hint.style.height = '0';
    hint.style.width = '0';
    hint.style.padding = '0';
  }

});

getProducts();

