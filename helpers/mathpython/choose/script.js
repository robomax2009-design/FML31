document.addEventListener("DOMContentLoaded", () => {
    const topicLists = document.querySelectorAll('.topics');

    topicLists.forEach(list => {
        const url = list.dataset.src;

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // выбираем заголовки h1, h2, h3
                const headers = doc.querySelectorAll('h1, h2, h3');
                headers.forEach(h => {
                    const li = document.createElement('li');
                    li.textContent = h.textContent;
                    list.appendChild(li);
                });
            })
            .catch(err => console.error(err));
    });
});