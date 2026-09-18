// Alpine.js data component
document.addEventListener('alpine:init', () => {
    Alpine.data('dashboardData', () => ({
        isDark: document.documentElement.classList.contains('dark'),
        sidebarOpen: false,
        activeTab: 'overview',
        alertsOpen: false,
        analyzing: false,
        showResult: false,
        scanning: false,
        
        navItems: [
            { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
            { id: 'ai-crop', label: 'AI Crop Recommendation', icon: 'sprout' },
            { id: 'disease', label: 'Disease Detection', icon: 'scan-line' },
            { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
        ],
        
        alerts: [
            { id: 1, title: 'Low Soil Moisture', message: 'Sector B is below 35%. Auto-irrigation queued.', type: 'warning', icon: 'droplets' },
            { id: 2, title: 'Storm Warning', message: 'Heavy rain expected in 4 hours.', type: 'danger', icon: 'cloud-lightning' },
            { id: 3, title: 'Optimal Harvest', message: 'Sector A wheat is ready for harvest.', type: 'info', icon: 'check-circle' }
        ],

        init() {
            // Check local storage for theme
            if (localStorage.getItem('theme') === 'light') {
                this.isDark = false;
                document.documentElement.classList.remove('dark');
            } else {
                this.isDark = true;
                document.documentElement.classList.add('dark');
            }

            // Watch for tab changes to initialize charts if needed
            this.$watch('activeTab', (value) => {
                if (value === 'analytics') {
                    // Slight delay to ensure DOM is updated before rendering charts
                    setTimeout(() => {
                        initAnalyticsCharts();
                    }, 50);
                }
            });

            // Init mini charts
            setTimeout(() => {
                initMiniCharts();
            }, 100);
        },

        toggleTheme() {
            this.isDark = !this.isDark;
            if (this.isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            
            // Re-render charts for theme colors
            if (this.activeTab === 'analytics') {
                setTimeout(() => { initAnalyticsCharts(); }, 100);
            }
            initMiniCharts();
        }
    }));
});

// Chart.js Configuration
let miniChartInstance = null;
let mainChartInstance = null;
let yieldChartInstance = null;
let resourceChartInstance = null;

function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        textColor: isDark ? '#9ca3af' : '#4b5563',
        gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        primary: '#22c55e',
        secondary: '#3b82f6',
        tertiary: '#a855f7'
    };
}

function initMiniCharts() {
    const ctx = document.getElementById('miniMarketChart');
    if (!ctx) return;
    
    if (miniChartInstance) {
        miniChartInstance.destroy();
    }
    
    const colors = getChartColors();
    
    miniChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                data: [220, 225, 222, 230, 235, 238, 240],
                borderColor: colors.tertiary,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            layout: { padding: 0 }
        }
    });
}

function initAnalyticsCharts() {
    const mainCtx = document.getElementById('mainAnalyticsChart');
    const yieldCtx = document.getElementById('yieldChart');
    const resourceCtx = document.getElementById('resourceChart');
    
    if (!mainCtx || !yieldCtx || !resourceCtx) return;
    
    const colors = getChartColors();
    
    // Destroy existing instances
    if (mainChartInstance) mainChartInstance.destroy();
    if (yieldChartInstance) yieldChartInstance.destroy();
    if (resourceChartInstance) resourceChartInstance.destroy();
    
    // Main Health Index Chart
    mainChartInstance = new Chart(mainCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [
                {
                    label: 'Sector A (Wheat)',
                    data: [82, 85, 87, 88, 92, 94],
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '20',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Sector B (Corn)',
                    data: [75, 78, 76, 80, 82, 85],
                    borderColor: colors.secondary,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: colors.textColor,
            plugins: {
                legend: { labels: { color: colors.textColor } }
            },
            scales: {
                x: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } },
                y: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor }, min: 60, max: 100 }
            }
        }
    });
    
    // Yield Prediction Bar Chart
    yieldChartInstance = new Chart(yieldCtx, {
        type: 'bar',
        data: {
            labels: ['Wheat', 'Corn', 'Soy'],
            datasets: [{
                label: 'Expected Yield (tons)',
                data: [12.5, 18.2, 8.4],
                backgroundColor: [colors.primary, colors.secondary, colors.tertiary],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: colors.textColor,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: colors.textColor } },
                y: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } }
            }
        }
    });

    // Resource Usage Doughnut
    resourceChartInstance = new Chart(resourceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Water', 'Fertilizer', 'Energy'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: [colors.secondary, colors.primary, '#f59e0b'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: colors.textColor,
            plugins: {
                legend: { position: 'bottom', labels: { color: colors.textColor, padding: 20 } }
            }
        }
    });
}
