// Q-robot INCAR Generator - JavaScript (Simplified)

let selectedTasks = [];
let currentParams = {};

// Initialize on page load
console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Page Initialization Started ===');
    initializeApp();
});

async function initializeApp() {
    try {
        console.log('Initializing app...');
        
        // Load task categories
        await initializeTaskCategories();
        console.log('✓ Task categories initialized');
        
        // Load standard parameters
        await loadStandardParameters();
        console.log('✓ Standard parameters loaded');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize app: ' + error.message);
    }
}

async function initializeTaskCategories() {
    const container = document.getElementById('taskCategories');
    if (!container) {
        console.error('taskCategories container not found');
        return;
    }
    
    try {
        console.log('Fetching task categories from API...');
        const response = await fetch('/api/task-categories');
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Task categories received:', data);
        
        if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error('Invalid response format');
        }
        
        let html = '';
        
        data.categories.forEach((categoryObj) => {
            const categoryName = categoryObj.name;
            const tasks = categoryObj.tasks;
            
            html += `<div class="task-category">`;
            html += `<h3 class="category-title">${categoryName}</h3>`;
            html += `<div class="task-buttons">`;
            
            Object.entries(tasks).forEach(([taskKey, taskData]) => {
                const taskName = taskData.display || taskKey;
                html += `<button class="btn-task" onclick="selectTask('${taskName}')" title="${taskName}">
                    ${taskName}
                </button>`;
            });
            
            html += `</div></div>`;
        });
        
        container.innerHTML = html;
        console.log('✓ Task categories rendered');
        
    } catch (error) {
        console.error('Error loading task categories:', error);
        container.innerHTML = `<p style="color: red; padding: 10px;">Error loading tasks: ${error.message}</p>`;
    }
}

async function loadStandardParameters() {
    const container = document.getElementById('standardSections');
    if (!container) {
        console.error('standardSections container not found');
        return;
    }
    
    try {
        console.log('Fetching standard parameters...');
        const response = await fetch('/api/standard-params');
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Standard parameters received');
        
        let html = '';
        Object.entries(data.standard || {}).forEach(([section, params]) => {
            const sectionName = section.replace('d_', '').toUpperCase();
            html += `<div class="param-section">`;
            html += `<label><input type="checkbox" onchange="toggleSection('${section}', this.checked)"> ${sectionName}</label>`;
            html += `</div>`;
        });
        
        container.innerHTML = html || '<p>No parameters found</p>';
        console.log('✓ Standard parameters rendered');
        
    } catch (error) {
        console.error('Error loading standard parameters:', error);
        container.innerHTML = `<p style="color: red; padding: 10px;">Error: ${error.message}</p>`;
    }
}

function selectTask(taskName) {
    console.log('Task selected:', taskName);
    
    if (!selectedTasks.includes(taskName)) {
        selectedTasks.push(taskName);
    }
    
    // Update UI
    updateTaskParams();
    updateIncarPreview();
}

function updateTaskParams() {
    const container = document.getElementById('taskParams');
    if (!container) return;
    
    if (selectedTasks.length === 0) {
        container.innerHTML = '<p class="info-text">Select a task to see its parameters</p>';
        return;
    }
    
    // Fetch params for selected tasks
    fetch('/api/task-params', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({task: selectedTasks[selectedTasks.length - 1]})
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            container.innerHTML = `<p style="color: red;">${data.error}</p>`;
            return;
        }
        
        let html = '<div>';
        Object.entries(data.params || {}).forEach(([key, value]) => {
            html += `<div class="param-row"><span>${key}</span> = <span>${value}</span></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    })
    .catch(err => {
        console.error('Error fetching task params:', err);
        container.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    });
}

function toggleSection(section, checked) {
    console.log('Section toggled:', section, checked);
}

function addCustomParam() {
    console.log('Add custom param clicked');
}

function removeCustomParam(btn) {
    btn.parentElement.remove();
}

async function generateIncar() {
    console.log('Generate INCAR clicked');
    
    const data = {
        tasks: selectedTasks,
        custom_params: {},
        include_sections: {}
    };
    
    try {
        const response = await fetch('/api/generate-incar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        const preview = document.getElementById('incarPreview');
        if (preview) {
            preview.value = result.incar || 'Error generating INCAR';
        }
    } catch (error) {
        console.error('Error generating INCAR:', error);
    }
}

function downloadIncar() {
    const preview = document.getElementById('incarPreview');
    if (!preview || !preview.value) {
        alert('No INCAR content to download');
        return;
    }
    
    const blob = new Blob([preview.value], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'INCAR';
    a.click();
    URL.revokeObjectURL(url);
}

function copyToClipboard() {
    const preview = document.getElementById('incarPreview');
    if (!preview || !preview.value) {
        alert('No INCAR content to copy');
        return;
    }
    
    preview.select();
    document.execCommand('copy');
    alert('INCAR copied to clipboard!');
}

function showError(message) {
    console.error(message);
    const container = document.getElementById('taskCategories');
    if (container) {
        container.innerHTML = `<div style="color: red; padding: 10px; background: #ffe6e6; border-radius: 5px;">${message}</div>`;
    }
}

function updateIncarPreview() {
    console.log('Updating INCAR preview...');
    generateIncar();
}

console.log('main.js initialization complete');
