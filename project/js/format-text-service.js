const textArea = document.getElementById('text-area');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const importBtn = document.getElementById('import-bt');
const exportBtn = document.getElementById('export-bt');

    // Форматирование текста
    function formatText(command) {
        document.execCommand(command, false, null);
        textArea.focus();
    }

    document.getElementById('bold-btn').addEventListener('click', () => formatText('bold'));
    document.getElementById('italic-btn').addEventListener('click', () => formatText('italic'));
    document.getElementById('underline-btn').addEventListener('click', () => formatText('underline'));
    document.getElementById('strike-btn').addEventListener('click', () => formatText('strikeThrough'));
    document.getElementById('ordered-list-btn').addEventListener('click', () => formatText('insertOrderedList'));
    document.getElementById('unordered-list-btn').addEventListener('click', () => formatText('insertUnorderedList'));

const filesData = {}; // Объект для хранения содержимого файлов
let activeFile = null; // Текущий активный файл

// Обработчик кнопки "Загрузить"
importBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
        const fileName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            let fileContent = '';

            // Обработка TXT
            if (file.type === 'text/plain') {
                fileContent = e.target.result;
                addFileToList(fileName, fileContent);
            } 
            // Обработка DOCX
            else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = e.target.result;
                mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then((result) => {
                        fileContent = result.value;
                        addFileToList(fileName, fileContent); // Передаем содержимое файла в обработчик
                    })
                    .catch((err) => {
                        console.error('Ошибка при обработке DOCX файла:', err);
                        alert('Не удалось обработать файл DOCX.');
                    });
            } else {
                alert('Поддерживаются только файлы TXT и DOCX.');
            }
        };

        if (file.type === 'text/plain') {
            reader.readAsText(file, 'utf-8');
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            reader.readAsArrayBuffer(file);
        }
    });
});

// Добавление файла в список
function addFileToList(fileName, fileContent) {
    filesData[fileName] = fileContent;

    // Создание кнопки для файла
    const fileButton = document.createElement('button');
    fileButton.textContent = fileName;
    fileButton.className = 'file-item';
    fileButton.dataset.fileName = fileName;

    // Установка обработчика для переключения файла
    fileButton.addEventListener('click', () => {
        saveActiveFile();
        setActiveFile(fileName);
    });

    // Добавляем кнопку в список файлов
    fileList.appendChild(fileButton);

    // Устанавливаем файл активным (если это первый файл или выбран новый)
    setActiveFile(fileName);
    textArea.innerText = filesData[fileName]
}

// Установка активного файла
function setActiveFile(fileName) {
    // Снимаем активность со всех кнопок
    Array.from(fileList.children).forEach((button) => button.classList.remove('active'));

    // Активируем текущую кнопку
    const activeButton = Array.from(fileList.children).find(
        (button) => button.dataset.fileName === fileName
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Проверяем существование текстовой области перед установкой
    if (textArea) {
        activeFile = fileName;
        textArea.innerText = filesData[fileName] || ''; // Устанавливаем содержимое или пустую строку
    } else {
        console.error('Текстовая область не найдена!');
    }
}

// Сохранение изменений текущего файла
function saveActiveFile() {
    if (activeFile) {
        filesData[activeFile] = textArea.innerText;
    }
}

// Скачивание активного файла
exportBtn.addEventListener('click', () => {
    saveActiveFile();
    if (!activeFile) {
        alert('Нет активного файла для сохранения.');
        return;
    }

    const text = filesData[activeFile];
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = activeFile;
    link.click();
});