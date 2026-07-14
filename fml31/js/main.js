// Код из visual.js (полностью)
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

window.addEventListener("resize", () => {});
window.addEventListener("scroll", () => {});


(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === '1') {
        localStorage.removeItem('jwt');
        console.log('JWT cleared by logout');
    }
})();

(function () {
    const WAKE_URL = 'https://tbs-server-s7vy.onrender.com/wake/';
    const INTERVAL_MS = 13 * 60 * 1000;
    function wake() {
        fetch(WAKE_URL, {
            method: 'GET',
            cache: 'no-store',
            credentials: 'omit',
        }).catch(() => {});
    }
    wake();
    setInterval(wake, INTERVAL_MS);
})();

update_animations();