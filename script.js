const carouselItems = fetch('config/projects.json')
.then((response) => response.json())
.then((data) => renderCarousel(data))
.catch((error) => console.error('Error loading carousel items:', error));

const carouselContainer = document.getElementById("carouselContainer");
  
function renderCarousel(items) {
  console.log(items);
  carouselContainer.innerHTML = items
    .map((item) => 
      `
      <div class="carousel-item">
        <a href="${item.link}" target="_blank">
          <img src="${item.image}" alt="${item.description}" />
          <div class="hover-card"><p>${item.description}</p></div>
        </a>
      </div>
      `
    )
    .join("");
}

const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

leftArrow.addEventListener('click', () => {
  carouselContainer.scrollBy({ left: -170, behavior: 'smooth' });
});

rightArrow.addEventListener('click', () => {
  carouselContainer.scrollBy({ left: 170, behavior: 'smooth' });
});
  