// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// User state management
let currentUser = null;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');

// Resource data
const resources = [
    { id: 'calculus-sem1', name: 'Calculus sem 1', category: 'mathematics', downloads: 1250, size: '2.3 MB', rating: 4.8 },
    { id: 'environment', name: 'Environment', category: 'evs', downloads: 1226, size: '3.8 MB', rating: 4.7 },
    { id: 'java-programming', name: 'Java', category: 'programming', downloads: 1117, size: '5.2 MB', rating: 4.8 },
    { id: 'electronics', name: 'Electronics', category: 'physics', downloads: 1103, size: '1.2 MB', rating: 4.5 },
    { id: 'digital-design', name: 'Digital Design', category: 'digital-design', downloads: 1100, size: '3.5 MB', rating: 4.8 },
    { id: 'python', name: 'Python Study Material', category: 'programming', downloads: 1050, size: '1.2 MB', rating: 4.4 }
];

// Search and filter functionality
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const resourceCards = document.querySelectorAll('.resource-card');

searchInput.addEventListener('input', filterResources);
filterButtons.forEach(btn => btn.addEventListener('click', function() {
    filterButtons.forEach(b => b.classList.remove('active', 'bg-blue-100', 'text-blue-800'));
    filterButtons.forEach(b => b.classList.add('bg-gray-100', 'text-gray-600'));
    this.classList.add('active', 'bg-blue-100', 'text-blue-800');
    this.classList.remove('bg-gray-100', 'text-gray-600');
    filterResources();
}));

function filterResources() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    resourceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const category = card.querySelector('span').textContent.toLowerCase();
        const matchesSearch = title.includes(searchTerm) || category.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);

        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal functionality
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const dashboardModal = document.getElementById('dashboard-modal');
const contactModal = document.getElementById('contact-modal');

// Login/Signup handlers
loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));

// Mobile login/signup handlers
document.getElementById('mobile-login-btn').addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    document.getElementById('mobile-menu').classList.add('hidden');
});
document.getElementById('mobile-signup-btn').addEventListener('click', () => {
    signupModal.classList.remove('hidden');
    document.getElementById('mobile-menu').classList.add('hidden');
});

document.getElementById('close-login').addEventListener('click', () => loginModal.classList.add('hidden'));
document.getElementById('close-signup').addEventListener('click', () => signupModal.classList.add('hidden'));
document.getElementById('close-dashboard').addEventListener('click', () => dashboardModal.classList.add('hidden'));
document.getElementById('close-contact').addEventListener('click', () => contactModal.classList.add('hidden'));

document.getElementById('show-signup').addEventListener('click', () => {
    loginModal.classList.add('hidden');
    signupModal.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', () => {
    signupModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// Form submissions
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login
    currentUser = { email, name: email.split('@')[0] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    loginModal.classList.add('hidden');
    updateUserInterface();
    showNotification('Successfully logged in!', 'success');
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Simulate signup
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    signupModal.classList.add('hidden');
    updateUserInterface();
    showNotification('Account created successfully!', 'success');
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // Simulate form submission
    contactModal.classList.add('hidden');
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Contact button
document.getElementById('contact-btn').addEventListener('click', () => {
    contactModal.classList.remove('hidden');
});

// Favorite functionality
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const resourceId = this.dataset.resource;
        const resourceName = this.closest('.resource-card').querySelector('h3').textContent;
        
        if (!currentUser) {
            showNotification('Please login to add favorites', 'error');
            return;
        }

        const icon = this.querySelector('i');
        if (favorites.includes(resourceId)) {
            favorites = favorites.filter(id => id !== resourceId);
            icon.classList.remove('fas', 'text-red-500');
            icon.classList.add('far');
            showNotification('Removed from favorites', 'info');
        } else {
            favorites.push(resourceId);
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-red-500');
            showNotification('Added to favorites', 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateDashboard();
    });
});

// Download functionality
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const resourceCard = this.closest('.resource-card');
        const resourceName = resourceCard.querySelector('h3').textContent;
        const resourceId = this.closest('.resource-card').querySelector('.favorite-btn').dataset.resource;
        
        if (!currentUser) {
            showNotification('Please login to download resources', 'error');
            return;
        }

        // Add to download history
        const download = {
            id: resourceId,
            name: resourceName,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        downloadHistory.unshift(download);
        if (downloadHistory.length > 10) downloadHistory.pop(); // Keep only last 10
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
        
        // Simulate download
        showNotification(`Downloading: ${resourceName}`, 'success');
        updateDashboard();
        
        // Create download link
        const link = document.createElement('a');
        link.href = this.href;
        link.download = this.download;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

// FAQ functionality
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('i');
        
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    });
});

// Update user interface based on login state
function updateUserInterface() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.textContent = currentUser.name;
        signupBtn.onclick = () => dashboardModal.classList.remove('hidden');
        
        // Add logout button
        if (!document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'text-gray-600 hover:text-red-600 transition ml-2';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.title = 'Logout';
            logoutBtn.onclick = logout;
            signupBtn.parentNode.insertBefore(logoutBtn, signupBtn.nextSibling);
        }
        
        updateDashboard();
    } else {
        loginBtn.style.display = 'block';
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = () => signupModal.classList.remove('hidden');
        
        // Remove logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.remove();
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Successfully logged out!', 'info');
}

// Update dashboard
function updateDashboard() {
    const downloadHistoryDiv = document.getElementById('download-history');
    const favoritesDiv = document.getElementById('favorites-list');
    
    if (downloadHistory.length > 0) {
        downloadHistoryDiv.innerHTML = downloadHistory.slice(0, 5).map(download => 
            `<div class="text-sm text-gray-600">${download.name}</div>`
        ).join('');
    }
    
    if (favorites.length > 0) {
        const favoriteResources = resources.filter(r => favorites.includes(r.id));
        favoritesDiv.innerHTML = favoriteResources.slice(0, 5).map(resource => 
            `<div class="text-sm text-gray-600">${resource.name}</div>`
        ).join('');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'notification-success',
        error: 'notification-error',
        info: 'notification-info',
        warning: 'notification-warning'
    };
    
    notification.classList.add(colors[type]);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Check for existing user on page load
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUserInterface();
}

// Button click handlers
document.querySelectorAll('button').forEach(button => {
    if (button.textContent.includes('Get Started')) {
        button.addEventListener('click', () => window.location.href = '#resources');
    }
    if (button.textContent.includes('Explore Resources')) {
        button.addEventListener('click', () => window.location.href = '#resources');
    }
    if (button.textContent.includes('Watch Videos')) {
        button.addEventListener('click', () => window.location.href = 'https://youtube.com');
    }
    if (button.textContent.includes('View All')) {
        button.addEventListener('click', () => window.location.href = '#resources');
    }
    if (button.textContent.includes('Load More Resources')) {
        button.addEventListener('click', () => {
            showNotification('Loading more resources...', 'info');
        });
    }
    if (button.textContent.includes('Browse Resources')) {
        button.addEventListener('click', () => window.location.href = '#resources');
    }
}); 

// Video Tutorial functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to navigate to YouTube video
    function navigateToVideo() {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    }
    
    // Add event listeners to play buttons using specific IDs
    const playButtonIds = ['play-btn-1', 'play-btn-2', 'play-btn-3'];
    const watchNowButtonIds = ['watch-now-1', 'watch-now-2', 'watch-now-3'];
    
    // Add click handlers to play buttons
    playButtonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Adding click handler to play button: ${id}`);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Play button ${id} clicked!`);
                navigateToVideo();
            });
        } else {
            console.log(`Play button ${id} not found`);
        }
    });
    
    // Add click handlers to Watch Now buttons
    watchNowButtonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Adding click handler to Watch Now button: ${id}`);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Watch Now button ${id} clicked!`);
                navigateToVideo();
            });
        } else {
            console.log(`Watch Now button ${id} not found`);
        }
    });
    
    // Also add click handlers to the entire video card for better UX
    const videoCards = document.querySelectorAll('.bg-white.rounded-xl.shadow-md.overflow-hidden.border.border-gray-100');
    console.log('Found video cards:', videoCards.length);
    
    videoCards.forEach((card, index) => {
        console.log(`Adding click handler to video card ${index + 1}`);
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons (to avoid double-triggering)
            if (!e.target.closest('button')) {
                console.log('Video card clicked!');
                navigateToVideo();
            }
        });
    });
}); 