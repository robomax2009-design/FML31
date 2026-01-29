document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.fraction').forEach(fr => {
        const parts = fr.innerHTML.split("/");
        if (parts.length === 2) {
            fr.innerHTML = `
                <span class="top">${parts[0]}</span>
                <span class="bottom">${parts[1]}</span>
            `;
        }
    });
});


const container = document.getElementById('table-container');
const shadow = container.attachShadow({ mode: 'open' });

fetch('table_solubility.html')
  .then(res => res.text())
  .then(html => {
    shadow.innerHTML = html;
    const scripts = shadow.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent.replace(
          /document\.getElementById\(/g,
          'shadow.querySelector('
        );
      }
      shadow.appendChild(newScript);
    });
    const table = shadow.querySelector('#my-table');
    if (table) {
      console.log('Количество строк:', table.rows.length);
    }
  })
  .catch(err => console.error(err));
