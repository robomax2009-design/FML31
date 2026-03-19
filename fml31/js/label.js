// Проверяем тип загрузки страницы
let isPageRefresh = false;

// Получаем информацию о навигации
const navigationEntries = performance.getEntriesByType('navigation');
if (navigationEntries.length > 0) {
    // type может быть: 'navigate' (обычный переход), 'reload' (обновление), 'back_forward' (назад/вперед)
    isPageRefresh = navigationEntries[0].type === 'reload';
}

// Проверяем реферер (переход с другой страницы сайта)
const referrer = document.referrer;
const currentDomain = window.location.hostname;
const isInternalNavigation = referrer && referrer.includes(currentDomain);

// Проверяем, мобильное ли устройство
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Показываем анимацию если:
// 1. Это не мобильное устройство И
// 2. (Это обновление страницы (F5) ИЛИ это не внутренний переход)
const shouldPlayAnimation = !isMobile && (isPageRefresh || !isInternalNavigation);

console.log('Тип загрузки:', navigationEntries[0]?.type);
console.log('Реферер:', referrer);
console.log('Внутренний переход:', isInternalNavigation);
console.log('Обновление страницы:', isPageRefresh);
console.log('Мобильное устройство:', isMobile);
console.log('Показывать анимацию:', shouldPlayAnimation);

if (shouldPlayAnimation) {
    // Подключаем красивые шрифты
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Cinzel:wght@900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Слово для анимации
    const word = 'SOMEL';
    const letters = [];

    // Удаляем старую анимацию если есть
    const oldAnimation = document.getElementById('somel-animation-container');
    if (oldAnimation) oldAnimation.remove();

    // Создаем контейнер
    const container = document.createElement('div');
    container.id = 'somel-animation-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '999999';
    container.style.transition = 'opacity 1.5s ease';
    document.body.appendChild(container);

    // Создаем эффект дыма/тумана
    const fog = document.createElement('div');
    fog.style.position = 'fixed';
    fog.style.top = '0';
    fog.style.left = '0';
    fog.style.width = '100%';
    fog.style.height = '100%';
    fog.style.background = 'radial-gradient(circle at 50% 50%, rgba(100,0,0,0.2), transparent 70%)';
    fog.style.zIndex = '999998';
    fog.style.pointerEvents = 'none';
    fog.style.transition = 'opacity 1.5s ease';
    container.appendChild(fog);

    // Создаем каждую букву
    for (let i = 0; i < word.length; i++) {
        const letter = document.createElement('div');
        letter.className = 'somel-fly';
        letter.textContent = word[i];
        letter.style.position = 'fixed';
        letter.style.top = '50%';
        letter.style.left = '-200px';
        letter.style.transform = 'translateY(-50%)';
        letter.style.color = '#000000';
        letter.style.fontSize = '200px';
        letter.style.fontWeight = '900';
        letter.style.fontFamily = "'Cinzel', 'Cormorant Garamond', serif";
        letter.style.textShadow = '2px 2px 4px rgba(139,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2)';
        letter.style.transition = 'left 1.2s cubic-bezier(0.2, 0.9, 0.3, 1.2), transform 0.3s ease, text-shadow 0.5s ease, color 0.5s ease';
        letter.style.zIndex = '1000000';
        letter.style.letterSpacing = 'normal';
        letter.style.opacity = '0.95';
        
        container.appendChild(letter);
        letters.push(letter);
    }

    // Анимируем каждую букву
    letters.forEach((letter, index) => {
        // Задержка для каждой буквы
        const delay = index * 80;
        
        setTimeout(() => {
            // Буква вылетает
            letter.style.left = '30%';
            letter.style.transform = 'translateY(-50%) scale(1.2)';
            
            // Легкое дрожание
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
                if (shakeCount < 3) {
                    const x = Math.random() * 6 - 3;
                    const y = Math.random() * 6 - 3;
                    letter.style.transform = `translateY(-50%) scale(1.2) translate(${x}px, ${y}px)`;
                    shakeCount++;
                } else {
                    clearInterval(shakeInterval);
                    letter.style.transform = 'translateY(-50%) scale(1.1)';
                }
            }, 40);
            
            // Буква занимает свою позицию
            setTimeout(() => {
                letter.style.left = `${30 + index * 7}%`;
                letter.style.transform = 'translateY(-50%) scale(1)';
                
                // Буквы светлеют к центру
                if (index === 2) { // M
                    letter.style.color = '#CC8800';
                    letter.style.textShadow = '0 0 10px #FFAA00, 0 0 20px #FFAA00, 2px 2px 4px #8B0000';
                } 
                else if (index === 3) { // E
                    letter.style.color = '#AA7700';
                    letter.style.textShadow = '0 0 8px #FFAA00, 0 0 16px #FFAA00, 2px 2px 4px #8B0000';
                }
                else if (index === 1) { // O
                    letter.style.color = '#884400';
                    letter.style.textShadow = '0 0 5px #FF8800, 0 0 10px #FF8800, 2px 2px 4px #8B0000';
                }
                else if (index === 4) { // L
                    letter.style.color = '#884400';
                    letter.style.textShadow = '0 0 5px #FF8800, 0 0 10px #FF8800, 2px 2px 4px #8B0000';
                }
                else {
                    letter.style.color = '#442200';
                    letter.style.textShadow = '0 0 3px #FF6600, 2px 2px 4px rgba(139,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2)';
                }
                
                // Пульсация для центральных букв
                if (index === 2 || index === 3) {
                    let pulseCount = 0;
                    const pulseInterval = setInterval(() => {
                        if (pulseCount < 6) {
                            if (pulseCount % 2 === 0) {
                                letter.style.textShadow = '0 0 20px #FFCC00, 0 0 30px #FFAA00, 0 0 40px #FF8800';
                                letter.style.color = '#FFAA00';
                            } else {
                                letter.style.textShadow = '0 0 10px #FFAA00, 0 0 20px #FFAA00, 2px 2px 4px #8B0000';
                                letter.style.color = '#CC8800';
                            }
                            pulseCount++;
                        } else {
                            clearInterval(pulseInterval);
                        }
                    }, 200);
                }
                
            }, 300);
            
            // Плавный уход букв
            setTimeout(() => {
                letter.style.transition = 'left 1s ease-in, opacity 0.8s, transform 0.6s, color 0.3s, text-shadow 0.3s';
                letter.style.left = '90%';
                letter.style.opacity = '0';
                letter.style.transform = 'translateY(-50%) scale(0.7) rotate(3deg)';
                letter.style.color = '#000000';
                letter.style.textShadow = '2px 2px 4px rgba(139,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2)';
            }, 1500);
            
        }, delay);
    });

    // Плавное исчезновение всего фона с буквами
    setTimeout(() => {
        container.style.opacity = '0';
    }, 2200);

    // Удаляем контейнер после полного исчезновения
    setTimeout(() => {
        if (container.parentNode) {
            container.remove();
        }
    }, 3700);

    // Падающий пепел
    const ashInterval = setInterval(() => {
        if (!document.getElementById('somel-animation-container') || 
            document.getElementById('somel-animation-container').style.opacity === '0') {
            clearInterval(ashInterval);
            return;
        }
        
        const ash = document.createElement('div');
        ash.style.position = 'fixed';
        ash.style.left = Math.random() * 100 + '%';
        ash.style.top = '-10px';
        ash.style.width = '3px';
        ash.style.height = '3px';
        ash.style.background = '#8B0000';
        ash.style.borderRadius = '50%';
        ash.style.boxShadow = '0 0 5px #8B0000';
        ash.style.opacity = '0.2';
        ash.style.zIndex = '999996';
        ash.style.pointerEvents = 'none';
        ash.style.animation = 'fall 4s linear forwards';
        
        if (!document.querySelector('#fall-animation')) {
            const style = document.createElement('style');
            style.id = 'fall-animation';
            style.textContent = `
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(ash);
        
        setTimeout(() => {
            if (ash.parentNode) ash.remove();
        }, 4000);
    }, 300);

    console.log('✅ Анимация проиграна на ПК');
} else if (isMobile) {
    console.log('📱 Мобильное устройство - анимация отключена');
} else {
    console.log('❌ Анимация пропущена');
}