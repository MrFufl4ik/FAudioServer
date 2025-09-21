document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInfo = document.getElementById('fileInfo');
    const linkInfo = document.getElementById('linkInfo');
    const fileDetails = document.getElementById('fileDetails');
    const linkDetails = document.getElementById('linkDetails');

    let selectedFile

    // Browse button click handler
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop event handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle the selected files
    function handleFiles(files) {

        // Validate files
        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('audio/');
        });

        if (validFiles.length === 0) {
            alert('Please select audio files only.');
            return;
        }

        selectedFile = validFiles[validFiles.length - 1]
        displayFileInfo(selectedFile);

        uploadBtn.disabled = false;
    }

    // Display file information
    function displayFileInfo(file) {
        fileDetails.innerHTML = '';

        const fileElement = document.createElement('div');
        fileElement.innerHTML = `
            <p><strong>${file.name}</strong> (${formatFileSize(file.size)})</p>
        `;
        fileDetails.appendChild(fileElement);

        fileInfo.classList.remove('hidden');
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Upload button click handler
    uploadBtn.addEventListener('click', () => {
        uploadBtn.disabled = true;
        const originalText = uploadBtn.textContent;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> загружаю...';

        const linkElement = document.createElement('div');
        const link = generateLinkBySelectedFile()
        linkElement.innerHTML = `
            <p>${link}</p>
        `
        linkDetails.innerHTML = ''
        linkDetails.appendChild(linkElement)
        linkInfo.classList.remove('hidden');

        setTimeout(() => {
            resetUI();
            uploadBtn.textContent = originalText;
        }, 2000);
    });

    linkDetails.addEventListener('click', () => {
        navigator.clipboard.writeText(generateLinkBySelectedFile());
    })

    function generateLinkBySelectedFile(){
        return "https://google.com"
    }

    // Reset UI after upload
    function resetUI() {
        uploadBtn.disabled = true;
        fileInfo.classList.add('hidden');
        fileInput.value = '';
        selectedFiles = [];
    }
});