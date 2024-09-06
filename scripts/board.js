document.addEventListener('DOMContentLoaded', function () {

    /**
     * Opens a dialog by loading content from an external HTML file.
     * Fetches the content from './addtask.html' and inserts it into the dialog container.
     */
    function openDialog() {
        fetch('./addtask.html')
            .then(response => response.text())
            .then(data => {
                const dialogContent = document.getElementById('dialog-content');
                if (dialogContent) {
                    dialogContent.innerHTML = data;
                    document.getElementById('dialog').classList.remove('d-none');
                    loadScripts();
                }
            })
            .catch(error => {
                console.error('Error loading the form:', error);
            });
    }

    /**
     * Dynamically loads external JavaScript files into the document.
     * Appends 'addtask.js' and 'script.js' scripts to the document body.
     */
    function loadScripts() {
        let script = document.createElement('script');
        script.src = './scripts/addtask.js';
        document.body.appendChild(script);
    }

    document.querySelector('.add-task').addEventListener('click', openDialog);
});
