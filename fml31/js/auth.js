// Авторизация
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

    loadHeaderProfile(jwtInfo.pub_id);
} else {
    document.getElementById('profile-name').textContent = 'Нет аккаунта!';
    const profileLink = document.getElementById('profile-link');
    profileLink.href = 'https://tbs-server-s7vy.onrender.com/dashboard/';
    profileLink.textContent = 'Войти';
}

// Проверка logout
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === '1') {
        localStorage.removeItem('jwt');
        console.log('JWT cleared by logout');
    }
})();

// Wake-up для сервера
(function() {
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