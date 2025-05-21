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
            
            // Disable form elements during processing
            setFormState(transcriptForm, false);
            
            // Show loading spinner
            spinner.style.display = 'block';
            
            // Extract transcript
            fetch('/extract-transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    youtube_url: youtubeUrl,
                    language: languageSelect.value
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide spinner
                spinner.style.display = 'none';
                
                // Re-enable form elements
                setFormState(transcriptForm, true);
                
                if (data.success) {
                    // Show transcript preview and options section
                    transcriptPreview.textContent = data.transcript;
                    optionsSection.style.display = 'block';
                    
                    // Scroll to options section
                    optionsSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Show success message
                    showAlert('Transcript extracted successfully!', 'success');
                    
                    // Add video ID as a hidden input to the blog form
                    let videoIdInput = document.getElementById('video-id-input');
                    if (!videoIdInput) {
                        videoIdInput = document.createElement('input');
                        videoIdInput.type = 'hidden';
                        videoIdInput.id = 'video-id-input';
                        videoIdInput.name = 'video_id';
                        blogForm.appendChild(videoIdInput);
                    }
                    videoIdInput.value = data.video_id;
                } else {
                    // Show error message
                    showAlert(data.error, 'error');
                }
            })
            .catch(error => {
                // Hide spinner
                spinner.style.display = 'none';
                
                // Re-enable form elements
                setFormState(transcriptForm, true);
                
                // Show error message
                showAlert('An error occurred while extracting the transcript. Please try again.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // Generate blog form submission
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Disable form elements during processing
            setFormState(blogForm, false);
            
            // Show loading spinner
            spinner.style.display = 'block';
            
            // Generate blog
            fetch('/generate-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    length: lengthSelect.value,
                    style: styleSelect.value,
                    keywords: keywordsInput.value.trim(),
                    title: customTitleInput.value.trim()
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide spinner
                spinner.style.display = 'none';
                
                // Re-enable form elements
                setFormState(blogForm, true);
                
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
                
                // Re-enable form elements
                setFormState(blogForm, true);
                
                // Show error message
                showAlert('An error occurred while generating the blog. Please try again.', 'error');
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
    
    // Get CSRF token from meta tag
    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }
    
    // Enable/disable form elements
    function setFormState(form, enabled) {
        const elements = form.querySelectorAll('input, select, textarea, button');
        elements.forEach(element => {
            element.disabled = !enabled;
        });
    }
    
    // Validate YouTube URL
    function isValidYouTubeUrl(url) {
        if (!url) return false;
        
        // More comprehensive regex for YouTube URLs
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}([\?&].*)?$/;
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
        // Disable button during processing
        const button = format === 'html' ? copyHtmlBtn : copyMarkdownBtn;
        if (button) button.disabled = true;
        
        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                format: format
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (button) button.disabled = false;
            
            if (data.success) {
                // Use modern clipboard API with fallback
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(data.content)
                        .then(() => {
                            showAlert(`${format.charAt(0).toUpperCase() + format.slice(1)} content copied to clipboard!`, 'success');
                        })
                        .catch(err => {
                            console.error('Clipboard API error:', err);
                            fallbackCopyToClipboard(data.content);
                        });
                } else {
                    fallbackCopyToClipboard(data.content);
                }
            } else {
                // Show error message
                showAlert(data.error, 'error');
            }
        })
        .catch(error => {
            if (button) button.disabled = false;
            
            // Show error message
            showAlert('An error occurred while copying the content.', 'error');
            console.error('Error:', error);
        });
    }
    
    // Fallback method for copying to clipboard
    function fallbackCopyToClipboard(text) {
        try {
            // Create a temporary textarea element to copy the content
            const textarea = document.createElement('textarea');
            textarea.value = text;
            
            // Make the textarea out of viewport
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                showAlert('Content copied to clipboard!', 'success');
            } else {
                showAlert('Unable to copy to clipboard. Please try again.', 'error');
            }
        } catch (err) {
            showAlert('Failed to copy content to clipboard.', 'error');
            console.error('Fallback clipboard error:', err);
        }
    }
    
    // Download content
    function downloadContent(format) {
        // Disable button during processing
        const button = format === 'html' ? downloadHtmlBtn : downloadMarkdownBtn;
        if (button) button.disabled = true;
        
        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                format: format
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (button) button.disabled = false;
            
            if (data.success) {
                // Create a blob with the content
                const blob = new Blob([data.content], { 
                    type: format === 'html' ? 'text/html' : 
                          format === 'markdown' ? 'text/markdown' : 
                          'text/plain' 
                });
                const url = URL.createObjectURL(blob);
                
                // Create a temporary link element to download the content
                const link = document.createElement('a');
                link.href = url;
                link.download = `blog.${format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'txt'}`;
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
                
                // Show success message
                showAlert(`${format.charAt(0).toUpperCase() + format.slice(1)} content downloaded!`, 'success');
            } else {
                // Show error message
                showAlert(data.error, 'error');
            }
        })
        .catch(error => {
            if (button) button.disabled = false;
            
            // Show error message
            showAlert('An error occurred while downloading the content.', 'error');
            console.error('Error:', error);
        });
    }
});
