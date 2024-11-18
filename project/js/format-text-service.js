const textArea = document.getElementById('text-area');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const importBtn = document.getElementById('import-bt');
const exportBtn = document.getElementById('export-bt');

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

const filesData = {};
let activeFile = null;
addFileToList('first-file.txt', '');

importBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
        const fileName = file.name;
        const reader = new FileReader();

        reader.onload = (e) => {
            let fileContent = '';
            if (file.type === 'text/plain') {
                fileContent = e.target.result;
                addFileToList(fileName, fileContent);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = e.target.result;
                mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then((result) => {
                        fileContent = result.value;
                        addFileToList(fileName, fileContent);
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
        } else {
            alert('Поддерживаются только файлы TXT и DOCX.');
        }
    });
});

function addFileToList(fileName, fileContent) {
    filesData[fileName] = fileContent;
    const spanFile = document.createElement('span');
    spanFile.className = 'icon-file-bt';
    const fileButton = document.createElement('button');
    fileButton.className="file-item";
    fileButton.appendChild(spanFile);
    const fileNameText = document.createTextNode(fileName);
    fileButton.appendChild(fileNameText);
    fileButton.dataset.fileName = fileName;

    fileButton.addEventListener('click', () => {
        saveActiveFile();
        setActiveFile(fileName);
    });

    fileList.appendChild(fileButton);
    setActiveFile(fileName);
    textArea.innerText = filesData[fileName] || '';
}

function setActiveFile(fileName) {
    if (!textArea) {
        console.error('Текстовая область не найдена!');
        return;
    }

    Array.from(fileList.children).forEach((button) => button.classList.remove('active'));

    const activeButton = Array.from(fileList.children).find(
        (button) => button.dataset.fileName === fileName
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }

    activeFile = fileName;
    textArea.innerText = filesData[fileName] || '';
}

function saveActiveFile() {
    if (activeFile) {
        filesData[activeFile] = textArea.innerText;
    }
}

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