try {
    ["zapret"].forEach(element => {
        let button = document.getElementById(element);
        let myDiv = document.getElementById("d" + element);

        button.addEventListener('click', function(n = n) {
            if (myDiv.style.display === 'none' || myDiv.style.display === '') {
                myDiv.style.display = 'block';
            } else {
                myDiv.style.display = 'none';
            }
        });
    });
} catch {}

function update_animations(){
  const cards = document.querySelectorAll('.card_container');
  cards.forEach(card => {
    card.addEventListener('mousemove', (event) => {
      const lighter = card.querySelector('.lighter');

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxY = rect.height;
      const maxX = rect.width;
      const rotateX = -((y / maxY) - 0.5) * 20;
      const rotateY = -((x / maxX) - 0.5) * -20;
      lighter.style.transition = 'none';
      lighter.style.marginTop = `${-7 - y / 15 + x / 20}px`;
      requestAnimationFrame(() => {
        lighter.style.transition = 'margin-top 0.6s cubic-bezier(.03,.7,.32,1)';
      });

      if (window.innerWidth <= 768) {
          card.style.transform = `
              perspective(350px)
              rotateX(0deg)
              rotateY(0deg)
              scale(1.15)
          `;
      } else {
          card.style.transform = `
              perspective(350px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              scale(1.15)
          `;
      }
    });

    card.addEventListener('mouseleave', () => {
      const lighter = card.querySelector('.lighter');
      lighter.style.marginTop = `0px`;
      if (window.innerWidth <= 768) {
          card.style.transform = `
              perspective(350px)
              rotateX(0deg)
              rotateY(0deg)
              scale(1)
          `;
      } else {
              card.style.transform = `
              perspective(350px)
              rotateX(0deg)
              rotateY(0deg)
              scale(1)
          `;
      }
    });
  });
}

const timestamp = new Date().getTime();
const filePath = `../news/news_short.html?v=${timestamp}`;
const newsDiv = document.getElementById('news');
fetch(filePath)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    return response.text();
  })
  .then(html => {
    newsDiv.innerHTML = html;
    update_animations();
  })
  .catch(error => {
    newsDiv.innerHTML = `<p>Не удалось загрузить новости: ${error}</p>`;
    console.error(error);
  });