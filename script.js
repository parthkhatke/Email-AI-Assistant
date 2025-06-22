
async function generateResponse() {
    const emailContent = document.getElementById('emailContent').value.trim();
    const tone = document.getElementById('tone').value;
    const emailResponseField = document.getElementById('emailResponse');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Validation
    if (!emailContent || !tone) {
        showNotification('Please fill in both email content and select a tone', 'error');
        return;
    }

    // Update UI to show loading state
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    emailResponseField.value = 'Generating response...';
    copyBtn.disabled = true;
    document.body.classList.add('loading');

    try {
        const response = await fetch('https://demo-email1.onrender.com/app/generateResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: tone
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        emailResponseField.value = data.response || 'No response received';
        copyBtn.disabled = false;
        showNotification('Response generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating response:', error);
        emailResponseField.value = 'Error: Could not generate response, backend server is running slow. Try again';
        showNotification('Failed to generate response. Please try again.', 'error');
    } finally {
        // Reset UI state
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
        document.body.classList.remove('loading');
    }
}

async function copyToClipboard() {
    const emailResponseField = document.getElementById('emailResponse');
    const copyBtn = document.getElementById('copyBtn');
    
    if (!emailResponseField.value || emailResponseField.value === 'Your AI-generated email response will appear here...') {
        showNotification('No content to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(emailResponseField.value);
        
        // Update button state
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Copied!
        `;
        copyBtn.classList.add('copied');
        
        showNotification('Response copied to clipboard!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Failed to copy text: ', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '1000',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    };
    
    Object.assign(notification.style, styles);
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
// Toggle About Section
function toggleAbout() {
    const aboutContent = document.getElementById('aboutContent');
    const aboutArrow = document.getElementById('aboutArrow');
    const aboutToggle = document.querySelector('.about-toggle');
    
    if (aboutContent.classList.contains('expanded')) {
        aboutContent.classList.remove('expanded');
        aboutToggle.classList.remove('rotated');
    } else {
        aboutContent.classList.add('expanded');
        aboutToggle.classList.add('rotated');
    }
}
// Optional: Allow Ctrl+Enter to trigger generation when focused on email content
document.getElementById('emailContent').addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        generateResponse();
    }
});

// Optional: Allow Enter to trigger generation when tone is selected
document.getElementById('tone').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        generateResponse();
    }
});
