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

window.addEventListener("resize", () => {});
window.addEventListener("scroll", () => {});

// Код авторизации (из index.html)
if (typeof jwtInfo !== 'undefined' && jwtInfo.authenticated) {
    console.log("pub_id:", jwtInfo.pub_id);

    async function loadHeaderProfile(pubId) {
        try {
            const response = await fetch(`http://k90908k8.beget.tech/profile/profile.php?action=get_profile&pub_id=${pubId}`, { cache: 'no-store' });
            const data = await response.json();

            if (data.success) {
                const profileName = document.getElementById('profile-name');
                profileName.textContent = data.data.name || 'Без имени';

                const profileLink = document.getElementById('profile-link');
                profileLink.href = `http://k90908k8.beget.tech/profile/profile.html?pub_id=${pubId}`;
                profileLink.textContent = 'Профиль';
                const profileLink2 = document.getElementById('profile-link2');
                profileLink2.href = `https://tbs-server-s7vy.onrender.com/dashboard/`;
                profileLink2.textContent = 'Панель инструментов';
                profileLink2.style.display = "inline-block";

                loadAvatar(pubId, data.avatar_url);
            } else {
                setNoAccount();
            }
        } catch (e) {
            console.error('Ошибка загрузки профиля', e);
            setNoAccount();
        }
    }

    function setNoAccount() {
        document.getElementById('profile-name').textContent = 'Нет аккаунта!';
        const profileLink = document.getElementById('profile-link');
        profileLink.href = 'https://tbs-server-s7vy.onrender.com/dashboard/';
        profileLink.textContent = 'Войти';
    }

    loadHeaderProfile(jwtInfo.pub_id);
    
    async function loadAvatar(pubId, avatarUrl = null) {
        const avatarImage = document.getElementById('avatar-image');
        const avatarInitial = document.getElementById('avatar-initial');
        const userName = document.getElementById('profile-name').textContent;
        avatarInitial.textContent = userName ? userName.charAt(0).toUpperCase() : '?';

        if (avatarUrl) {
            avatarImage.onload = function() {
                avatarInitial.style.display = 'none';
                avatarImage.style.display = 'block';
            };
            avatarImage.onerror = function() {
                avatarInitial.style.display = 'flex';
                avatarImage.style.display = 'none';
            };
            avatarImage.src = avatarUrl + (avatarUrl.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
        } else {
            avatarImage.onload = function() {
                avatarInitial.style.display = 'none';
                avatarImage.style.display = 'block';
            };
            avatarImage.onerror = function() {
                avatarInitial.style.display = 'flex';
                avatarImage.style.display = 'none';
            };
            avatarImage.src = `https://tbs-server-s7vy.onrender.com/avatar/?pub_id=${pubId}&format=image&t=${new Date().getTime()}`;
        }
    }
} else {
    document.getElementById('profile-name').textContent = 'Нет аккаунта!';
    const profileLink = document.getElementById('profile-link');
    profileLink.href = 'https://tbs-server-s7vy.onrender.com/dashboard/';
    profileLink.textContent = 'Войти';
}

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