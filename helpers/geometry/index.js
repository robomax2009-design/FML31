document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const classParam = urlParams.get('class');
    const cardParam = urlParams.get('card');

    if (classParam && cardParam) {
        // Используем локальный прокси вместо прямого URL
        const proxyUrl = `http://k90908k8.beget.tech/helpers/geometry/proxy.php?class=${classParam}&card=${cardParam}`;
        console.log(`Загружаем контент через прокси: ${proxyUrl}`);

        const pageElement = document.getElementById('page');

        if (!pageElement) {
            console.error('Элемент с id "page" не найден на странице.');
            return;
        }

        pageElement.innerHTML = '<p style="text-align: center;">Загрузка материала...</p>';

        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || `HTTP error! Статус: ${response.status}`);
                    }).catch(() => {
                        throw new Error(`HTTP error! Статус: ${response.status}`);
                    });
                }
                return response.text();
            })
            .then(htmlContent => {
                htmlContent = htmlContent.replace(/img\/(\d+)\.png/g, (match, number) => {
                    return `${proxyUrl}&img=${number}`;
                });
                htmlContent = htmlContent.replace(/((?:\.\.\/)*)css\/style\.css/g, `style.css`);
                
                htmlContent = htmlContent.replace(
                    /<script type="text\/x-mathjax-config">[\s\S]*?<\/script>\s*<script src="\.\/SOMEL - геометрия_files\/MathJax\.js\.загрузка"[^>]*><\/script>/,
                    ''
                );
                htmlContent = htmlContent.replace(/((?:\.\.\/)+)(\d+)/g, `${classParam}.html`);
                htmlContent = htmlContent.replace(
                    /\.\.\/\.\.\/\.\.\/9/g, 
                    `${classParam}.html`
                );
                htmlContent = htmlContent.replace(
                    /\.\.\/\.\.\/\.\./g, 
                    `index.html`
                );
                htmlContent = htmlContent.replace(
                    /\.\.\/\.\./g, 
                    `${classParam}.html`
                );
                htmlContent = htmlContent.replace(
                    /main-link/g, 
                    `main_link`
                );
                htmlContent = htmlContent.replace("Нашли ошибку?", "");
                htmlContent = htmlContent.replace("Выделите ее и нажмите Ctrl + Enter", "");
                
                pageElement.innerHTML = htmlContent;
                
                function reloadMathJax() {
                    const scripts = document.querySelectorAll('script[src*="mathjax"], script[src*="MathJax"]');
                    scripts.forEach(script => script.remove());
                    
                    const configs = document.querySelectorAll('script[type="text/x-mathjax-config"]');
                    configs.forEach(config => config.remove());
                    
                    if (window.MathJax) {
                        delete window.MathJax;
                    }
                    
                    const config = document.createElement('script');
                    config.type = 'text/x-mathjax-config';
                    config.text = `
                        MathJax.Hub.Config({
                            tex2jax: {
                                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                                processEscapes: true
                            },
                            "HTML-CSS": { 
                                linebreaks: { automatic: false },
                                scale: 100,
                                styles: {
                                    ".MathJax_Display": {
                                        "text-align": "center",
                                        margin: "1em 0em"
                                    }
                                }
                            },
                            SVG: { 
                                linebreaks: { automatic: true }
                            },
                            displayAlign: "center",
                            messageStyle: "none"
                        });
                        
                        // Добавляем обработчик для повторного рендера при загрузке страницы
                        MathJax.Hub.Register.StartupHook("End", function() {
                            console.log("MathJax успешно загружен и обработал формулы");
                            
                            // Исправляем возможные проблемы с отображением
                            setTimeout(function() {
                                MathJax.Hub.Queue(["Rerender", MathJax.Hub]);
                            }, 500);
                        });
                    `;
                    document.head.appendChild(config);
                    
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
                    script.async = true;
                    
                    script.onload = function() {
                        console.log('MathJax загружен, запускаем обработку формул');
                        if (window.MathJax) {
                            setTimeout(function() {
                                MathJax.Hub.Queue(["Typeset", MathJax.Hub, pageElement]);
                            }, 100);
                        }
                    };
                    
                    document.head.appendChild(script);
                    const style = document.querySelector('link[href="index.css"]');
                    if (style) {
                        style.remove();
                    }
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = `index.css`;
                    document.head.appendChild(newLink);
                }
                
                setTimeout(reloadMathJax, 20);
                
                console.log('Контент успешно загружен и вставлен.');
            })
            .catch(error => {
                console.error('Ошибка при загрузке контента:', error);
                pageElement.innerHTML = `<p style="color: red; text-align: center;">Ошибка загрузки материала. Детали: ${error.message}</p>`;
            });
    } else {
        console.log('Параметры class или card не найдены в URL.');
        const pageElement = document.getElementById('page');
        if (pageElement) {
            pageElement.innerHTML = '<p style="text-align: center;">Укажите параметры class и card в URL (например, ?class=8&card=5).</p>';
        }
    }
});