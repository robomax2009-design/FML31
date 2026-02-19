// Модуль для загрузки новостей

function loadNews() {
    const newsDiv = document.getElementById('news');
    
    if (!newsDiv) {
        console.log('Блок новостей не найден');
        return;
    }
    
    const timestamp = new Date().getTime();
    const filePath = `../news/news_short.html?v=${timestamp}`;
    
    console.log('Загрузка новостей из:', filePath);
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            newsDiv.innerHTML = html;
            console.log('Новости загружены');
            
            // Переинициализируем анимации карточек после загрузки новостей
            if (typeof window.initCardAnimations === 'function') {
                setTimeout(() => {
                    window.initCardAnimations();
                }, 200);
            }
        })
        .catch(error => {
            newsDiv.innerHTML = `<p style="color: #ff6b6b;">Не удалось загрузить новости: ${error.message}</p>`;
            console.error('Ошибка загрузки новостей:', error);
        });
}

// Загружаем новости после загрузки DOM
document.addEventListener('DOMContentLoaded', loadNews);