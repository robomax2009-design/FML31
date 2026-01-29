const toggleBtn = document.getElementById('toggleExpressions');
const subExpCheckbox = document.getElementById('subexpression');

toggleBtn.addEventListener('click', () => {
    // переключаем состояние чекбокса
    subExpCheckbox.checked = !subExpCheckbox.checked;

    // обновляем текст и цвет кнопки
    if(subExpCheckbox.checked){
        toggleBtn.textContent = "Показываем промежуточные выражения";
        toggleBtn.classList.remove("red");
    } else {
        toggleBtn.textContent = "Скрываем промежуточные выражения";
        toggleBtn.classList.add("red");
    }

    // вызываем функцию обработки формулы
    processInput();
});
