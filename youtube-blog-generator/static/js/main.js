// Main JavaScript for YouTube Transcript to Blog Generator

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const transcriptForm = document.getElementById('transcript-form');
    const blogForm = document.getElementById('blog-form');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const languageSelect = document.getElementById('language');
    const extractBtn = document.getElementById('extract-btn');
    const optionsSection = document.getElementById('options-section');
    const transcriptPreview = document.getElementById('transcript-preview');
    const generateBtn = document.getElementById('generate-btn');
    const lengthSelect = document.getElementById('length');
    const styleSelect = document.getElementById('style');
    const keywordsInput = document.getElementById('keywords');
    const customTitleInput = document.getElementById('custom-title');
    const alertContainer = document.getElementById('alert-container');
    const spinner = document.getElementById('spinner');
    
    // Export buttons (on result page)
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    const downloadHtmlBtn = document.getElementById('download-html-btn');
    const downloadMarkdownBtn = document.getElementById('download-markdown-btn');
    
    // Extract transcript form submission
    if (transcriptForm) {
        transcriptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate YouTube URL
            const youtubeUrl = youtubeUrlInput.value.trim();
            if (!isValidYouTubeUrl(youtubeUrl)) {
                showAlert('Please enter a valid YouTube URL.', 'error');
                return;
            }
            
            // Show loading spinner
            spinner.style.display = 'block';
            
            // Extract transcript
            fetch('/extract-transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    youtube_url: youtubeUrl,
                    language: languageSelect.value
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Hide spinner
                spinner.style.display = 'none';
                
                if (data.success) {
                    // Show transcript preview and options section
                    transcriptPreview.textContent = data.transcript;
                    optionsSection.style.display = 'block';
                    
                    // Scroll to options section
                    optionsSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Show success message
                    showAlert('Transcript extracted successfully!', 'success');
                    
                    // Add video ID as a hidden input to the blog form
                    const videoIdInput = document.createElement('input');
                    videoIdInput.type = 'hidden';
                    videoIdInput.name = 'video_id';
                    videoIdInput.value = data.video_id;
                    blogForm.appendChild(videoIdInput);
                } else {
                    // Show error message
                    showAlert(data.error, 'error');
                }
            })
            .catch(error => {
                // Hide spinner
                spinner.style.display = 'none';
                
                // Show error message
                showAlert('An error occurred while extracting the transcript.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // Generate blog form submission
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading spinner
            spinner.style.display = 'block';
            
            // Generate blog
            fetch('/generate-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    length: lengthSelect.value,
                    style: styleSelect.value,
                    keywords: keywordsInput.value.trim(),
                    title: customTitleInput.value.trim()
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Hide spinner
                spinner.style.display = 'none';
                
                if (data.success) {
                    // Redirect to result page
                    window.location.href = data.redirect;
                } else {
                    // Show error message
                    showAlert(data.error, 'error');
                }
            })
            .catch(error => {
                // Hide spinner
                spinner.style.display = 'none';
                
                // Show error message
                showAlert('An error occurred while generating the blog.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // Export functionality (on result page)
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', function() {
            copyToClipboard('html');
        });
    }
    
    if (copyMarkdownBtn) {
        copyMarkdownBtn.addEventListener('click', function() {
            copyToClipboard('markdown');
        });
    }
    
    if (downloadHtmlBtn) {
        downloadHtmlBtn.addEventListener('click', function() {
            downloadContent('html');
        });
    }
    
    if (downloadMarkdownBtn) {
        downloadMarkdownBtn.addEventListener('click', function() {
            downloadContent('markdown');
        });
    }
    
    // Helper Functions
    
    // Validate YouTube URL
    function isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[a-zA-Z0-9_-]{11}(&.*)?$/;
        return youtubeRegex.test(url);
    }
    
    // Show alert message
    function showAlert(message, type) {
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.textContent = message;
        
        // Clear previous alerts
        alertContainer.innerHTML = '';
        
        // Add alert to container
        alertContainer.appendChild(alertElement);
        
        // Auto-remove alert after 5 seconds
        setTimeout(function() {
            alertElement.remove();
        }, 5000);
    }
    
    // Copy content to clipboard
    function copyToClipboard(format) {
        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                format: format
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Create a temporary textarea element to copy the content
                const textarea = document.createElement('textarea');
                textarea.value = data.content;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                // Show success message
                showAlert(`${format.charAt(0).toUpperCase() + format.slice(1)} content copied to clipboard!`, 'success');
            } else {
                // Show error message
                showAlert(data.error, 'error');
            }
        })
        .catch(error => {
            // Show error message
            showAlert('An error occurred while copying the content.', 'error');
            console.error('Error:', error);
        });
    }
    
    // Download content
    function downloadContent(format) {
        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                format: format
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Create a blob with the content
                const blob = new Blob([data.content], { type: format === 'html' ? 'text/html' : 'text/markdown' });
                const url = URL.createObjectURL(blob);
                
                // Create a temporary link element to download the content
                const link = document.createElement('a');
                link.href = url;
                link.download = `blog.${format === 'html' ? 'html' : 'md'}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                showAlert(`${format.charAt(0).toUpperCase() + format.slice(1)} content downloaded!`, 'success');
            } else {
                // Show error message
                showAlert(data.error, 'error');
            }
        })
        .catch(error => {
            // Show error message
            showAlert('An error occurred while downloading the content.', 'error');
            console.error('Error:', error);
        });
    }
});

