/**
 * 企业级数据可视化看板JavaScript功能实现
 * 包含粒子背景、实时时间、数字滚动动画、Chart.js图表和自动刷新功能
 */

// 全局变量
let visitChart = null; // 访问量趋势图实例
let sourceChart = null; // 用户来源饼图实例
let regionChart = null; // 用户地域分布柱状图实例
let salesChart = null; // 销售趋势分析面积图实例
let refreshIntervalId = null; // 自动刷新定时器ID
let currentRefreshInterval = 10000; // 当前刷新间隔（毫秒）
let currentTheme = 'dark'; // 当前主题

/**
 * 页面加载完成后初始化所有功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticles();
    
    // 初始化实时时间
    initCurrentTime();
    
    // 初始化数字滚动动画
    initNumberAnimation();
    
    // 初始化图表
    initCharts();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 设置自动刷新数据
    setRefreshInterval(currentRefreshInterval);
});

/**
 * 初始化粒子背景
 */
function initParticles() {
    // 配置粒子背景
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#4fc3f7"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#4fc3f7",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

/**
 * 初始化实时时间显示
 */
function initCurrentTime() {
    // 更新时间函数
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }
    
    // 立即更新一次
    updateTime();
    
    // 每秒更新一次
    setInterval(updateTime, 1000);
}

/**
 * 数字滚动动画效果
 * @param {HTMLElement} element - 要显示数字的DOM元素
 * @param {number} target - 目标数字
 * @param {number} duration - 动画持续时间（毫秒）
 * @param {boolean} isPercentage - 是否为百分比
 */
function animateNumber(element, target, duration = 2000, isPercentage = false) {
    let start = 0;
    const increment = target / (duration / 16); // 基于16ms帧率计算每次增量
    
    function updateNumber() {
        start += increment;
        if (start >= target) {
            if (isPercentage) {
                element.textContent = `${target.toFixed(2)}%`;
            } else {
                element.textContent = formatNumber(Math.floor(target));
            }
            return;
        }
        
        if (isPercentage) {
            element.textContent = `${start.toFixed(2)}%`;
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    updateNumber();
}

/**
 * 格式化数字，添加千位分隔符
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的数字字符串
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 初始化数字滚动动画
 */
function initNumberAnimation() {
    // 今日新增用户目标值（随机生成）
    const activeUsersTarget = Math.floor(Math.random() * 5000) + 1000;
    const newUsersTarget = Math.floor(Math.random() * 1000) + 500;
    const totalAmountTarget = Math.floor(Math.random() * 1000000) + 500000;
    const conversionRateTarget = Math.random() * 10 + 1;
    
    // 应用数字滚动动画
    animateNumber(document.getElementById('activeUsers'), activeUsersTarget);
    animateNumber(document.getElementById('newUsers'), newUsersTarget);
    animateNumber(document.getElementById('totalAmount'), totalAmountTarget);
    animateNumber(document.getElementById('conversionRate'), conversionRateTarget, 2000, true);
}

/**
 * 初始化所有图表
 */
function initCharts() {
    // 初始化访问量趋势图
    initVisitChart();
    
    // 初始化用户来源饼图
    initSourceChart();
    
    // 初始化用户地域分布柱状图
    initRegionChart();
    
    // 初始化销售趋势分析面积图
    initSalesChart();
}

/**
 * 初始化近7天用户访问量趋势图（折线图）
 */
function initVisitChart() {
    const ctx = document.getElementById('visitChart').getContext('2d');
    
    // 生成近7天日期标签
    const labels = generateLast7Days();
    
    // 生成随机访问量数据
    const data = generateRandomData(7, 500, 2000);
    
    visitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '访问量',
                data: data,
                borderColor: '#4fc3f7',
                backgroundColor: 'rgba(79, 195, 247, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4fc3f7',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#4fc3f7',
                pointHoverBorderWidth: 3,
                pointShadowColor: '#4fc3f7',
                pointShadowBlur: 10,
                borderDash: [],
                borderDashOffset: 0.0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: currentTheme === 'dark' ? '#ffffff' : '#1a1f3a',
                        font: {
                            size: 14,
                            weight: 600
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: currentTheme === 'dark' ? 'rgba(10, 14, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: currentTheme === 'dark' ? '#e0f7fa' : '#1a1f3a',
                    bodyColor: currentTheme === 'dark' ? '#ffffff' : '#1a1f3a',
                    borderColor: '#4fc3f7',
                    borderWidth: 2,
                    padding: 15,
                    cornerRadius: 12,
                    displayColors: true,
                    boxPadding: 10,
                    callbacks: {
                        title: function(tooltipItems) {
                            return `日期: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `访问量: ${formatNumber(context.parsed.y)}`;
                        }
                    },
                    filter: function(tooltipItem, data) {
                        return tooltipItem.parsed.y !== null;
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 14, 39, 0.1)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 14, 39, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15
                    }
                },
                y: {
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 14, 39, 0.1)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 14, 39, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15,
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    },
                    min: Math.min(...data) * 0.8,
                    max: Math.max(...data) * 1.2
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            elements: {
                line: {
                    tension: 0.4
                }
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

/**
 * 初始化用户来源渠道占比饼图
 */
function initSourceChart() {
    const ctx = document.getElementById('sourceChart').getContext('2d');
    
    // 用户来源数据
    const sources = ['微信', '抖音', '官网', '其他'];
    const colors = [
        '#4fc3f7', // 蓝色 - 微信
        '#81c784', // 绿色 - 抖音
        '#ffb74d', // 橙色 - 官网
        '#9575cd'  // 紫色 - 其他
    ];
    const data = generateRandomData(4, 100, 500);
    
    sourceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: sources,
            datasets: [{
                data: data,
                backgroundColor: colors.map(color => color + 'CC'), // 增加透明度
                borderColor: '#1a1f3a',
                borderWidth: 4,
                hoverBackgroundColor: colors,
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 3,
                shadowColor: '#000000',
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowOffsetY: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: 25,
                        font: {
                            size: 14,
                            weight: 600
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    titleColor: '#e0f7fa',
                    bodyColor: '#ffffff',
                    borderColor: '#4fc3f7',
                    borderWidth: 2,
                    padding: 15,
                    cornerRadius: 12,
                    callbacks: {
                        title: function(tooltipItems) {
                            return `渠道: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return `数量: ${formatNumber(context.parsed)} (${percentage}%)`;
                        }
                    },
                    filter: function(tooltipItem, data) {
                        return tooltipItem.parsed !== null;
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    });
}

/**
 * 初始化用户地域分布柱状图
 */
function initRegionChart() {
    const ctx = document.getElementById('regionChart').getContext('2d');
    
    // 用户地域分布数据
    const regions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];
    const colors = [
        '#4fc3f7', '#64b5f6', '#90caf9', '#bbdefb',
        '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e8'
    ];
    const data = generateRandomData(8, 500, 3000);
    
    regionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions,
            datasets: [{
                label: '用户数量',
                data: data,
                backgroundColor: colors.map(color => color + 'E0'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: colors,
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 3,
                shadowColor: '#000000',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    titleColor: '#e0f7fa',
                    bodyColor: '#ffffff',
                    borderColor: '#4fc3f7',
                    borderWidth: 2,
                    padding: 15,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return `地区: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `用户数量: ${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15,
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    },
                    min: 0,
                    max: Math.max(...data) * 1.2
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

/**
 * 初始化销售趋势分析面积图
 */
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // 生成近7天日期标签
    const labels = generateLast7Days();
    
    // 生成随机销售数据
    const data = generateRandomData(7, 100000, 500000);
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '销售额',
                data: data,
                borderColor: '#81c784',
                backgroundColor: 'rgba(129, 199, 132, 0.3)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#81c784',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#81c784',
                pointHoverBorderWidth: 3,
                pointShadowColor: '#81c784',
                pointShadowBlur: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    titleColor: '#e0f7fa',
                    bodyColor: '#ffffff',
                    borderColor: '#81c784',
                    borderWidth: 2,
                    padding: 15,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return `日期: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `销售额: ¥${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        drawTicks: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12,
                            weight: 500
                        },
                        padding: 15,
                        callback: function(value) {
                            return `¥${formatNumber(value)}`;
                        }
                    },
                    min: Math.min(...data) * 0.8,
                    max: Math.max(...data) * 1.2
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

/**
 * 生成近7天的日期标签
 * @returns {Array} 近7天日期数组
 */
function generateLast7Days() {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        days.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
    }
    
    return days;
}

/**
 * 生成指定数量的随机数据
 * @param {number} count - 数据数量
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Array} 随机数据数组
 */
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

/**
 * 刷新所有数据
 */
function refreshData() {
    // 获取所有卡片元素
    const cards = document.querySelectorAll('.card, .metric-card');
    
    // 为所有卡片添加更新动画
    cards.forEach(card => {
        card.classList.add('updating');
        // 动画结束后移除类
        setTimeout(() => {
            card.classList.remove('updating');
        }, 1000);
    });
    
    // 刷新数字卡片数据
    refreshNumberCards();
    
    // 刷新访问量趋势图
    refreshVisitChart();
    
    // 刷新用户来源饼图
    refreshSourceChart();
    
    // 刷新用户地域分布柱状图
    refreshRegionChart();
    
    // 刷新销售趋势分析面积图
    refreshSalesChart();
}

/**
 * 刷新数字卡片数据
 */
function refreshNumberCards() {
    // 生成新的随机目标值
    const activeUsersTarget = Math.floor(Math.random() * 5000) + 1000;
    const newUsersTarget = Math.floor(Math.random() * 1000) + 500;
    const totalAmountTarget = Math.floor(Math.random() * 1000000) + 500000;
    const conversionRateTarget = Math.random() * 10 + 1;
    
    // 应用数字滚动动画
    animateNumber(document.getElementById('activeUsers'), activeUsersTarget);
    animateNumber(document.getElementById('newUsers'), newUsersTarget);
    animateNumber(document.getElementById('totalAmount'), totalAmountTarget);
    animateNumber(document.getElementById('conversionRate'), conversionRateTarget, 2000, true);
}

/**
 * 刷新近7天用户访问量趋势图
 */
function refreshVisitChart() {
    if (visitChart) {
        // 生成新的随机数据
        const newData = generateRandomData(7, 500, 2000);
        
        // 更新图表数据
        visitChart.data.datasets[0].data = newData;
        visitChart.update('active');
    }
}

/**
 * 刷新用户来源饼图
 */
function refreshSourceChart() {
    if (sourceChart) {
        // 生成新的随机数据
        const newData = generateRandomData(4, 100, 500);
        
        // 更新图表数据
        sourceChart.data.datasets[0].data = newData;
        sourceChart.update('active');
    }
}

/**
 * 刷新用户地域分布柱状图
 */
function refreshRegionChart() {
    if (regionChart) {
        // 生成新的随机数据
        const newData = generateRandomData(8, 500, 3000);
        
        // 更新图表数据
        regionChart.data.datasets[0].data = newData;
        regionChart.update('active');
    }
}

/**
 * 刷新销售趋势分析面积图
 */
function refreshSalesChart() {
    if (salesChart) {
        // 生成新的随机数据
        const newData = generateRandomData(7, 100000, 500000);
        
        // 更新图表数据
        salesChart.data.datasets[0].data = newData;
        salesChart.update('active');
    }
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 刷新按钮点击事件
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });
    }
    
    // 时间范围选择事件
    const timeRangeSelect = document.getElementById('timeRangeSelect');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            const timeRange = this.value;
            handleTimeRangeChange(timeRange);
        });
    }
    
    // 主题切换事件
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            switchTheme(theme);
        });
    }
    
    // 刷新间隔选择事件
    const refreshIntervalSelect = document.getElementById('refreshInterval');
    if (refreshIntervalSelect) {
        refreshIntervalSelect.addEventListener('change', function() {
            const interval = parseInt(this.value);
            setRefreshInterval(interval);
        });
    }
    
    // 全屏切换事件
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreenDashboard);
    }
    
    // 导航菜单点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 直接根据菜单项索引确定目标页面
            const index = Array.from(navLinks).indexOf(this);
            let pageId = '';
            
            // 根据索引确定目标页面
            switch(index) {
                case 0:
                    pageId = 'home-page';
                    break;
                case 1:
                    pageId = 'user-analysis-page';
                    break;
                case 2:
                    pageId = 'sales-data-page';
                    break;
                case 3:
                    pageId = 'settings-page';
                    break;
                default:
                    pageId = 'home-page';
            }
            
            // 切换页面
            switchPage(pageId);
            
            // 移除所有活动状态
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            // 添加当前活动状态
            this.parentElement.classList.add('active');
        });
    });
    
    // 卡片操作按钮事件
    const cardActionBtns = document.querySelectorAll('.card-action-btn');
    cardActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.title;
            // 这里可以添加具体的操作逻辑
            console.log('Card action:', action);
        });
    });
}

/**
 * 处理时间范围变化
 * @param {string} timeRange - 时间范围
 */
function handleTimeRangeChange(timeRange) {
    console.log('Time range changed to:', timeRange);
    // 这里可以根据时间范围更新图表数据
    // 目前只是刷新数据，实际项目中应该根据时间范围获取不同的数据
    refreshData();
}

/**
 * 主题切换功能
 * @param {string} theme - 主题名称（dark或light）
 */
function switchTheme(theme) {
    currentTheme = theme;
    
    // 更新粒子背景颜色
    const particlesJs = document.getElementById('particles-js');
    if (particlesJs) {
        if (theme === 'dark') {
            particlesJs.style.background = 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d3748 100%)';
        } else {
            particlesJs.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)';
        }
    }
    
    // 更新body背景和文字颜色
    document.body.className = theme;
    
    // 更新所有卡片和指标卡片的背景和边框
    const cards = document.querySelectorAll('.card, .metric-card');
    cards.forEach(card => {
        if (theme === 'dark') {
            card.style.background = 'linear-gradient(135deg, rgba(10, 14, 39, 0.9), rgba(26, 31, 58, 0.85))';
            card.style.borderColor = 'rgba(79, 195, 247, 0.2)';
        } else {
            card.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(235, 243, 255, 0.85))';
            card.style.borderColor = 'rgba(79, 195, 247, 0.4)';
        }
    });
    
    // 更新文字颜色
    const texts = document.querySelectorAll('h1, h2, h3, h4, p, span, .metric-title, .metric-desc, .metric-value, .card-header h3');
    texts.forEach(text => {
        if (theme === 'light') {
            text.style.color = '#1a1f3a';
        } else {
            text.style.color = '#ffffff';
        }
    });
    
    // 重新初始化图表以适应新主题
    initCharts();
    if (document.getElementById('userGrowthChart')) {
        initUserAnalysisCharts();
    }
    if (document.getElementById('salesTrendChart')) {
        initSalesDataCharts();
    }
}

/**
 * 设置刷新间隔
 * @param {number} interval - 刷新间隔（毫秒）
 */
function setRefreshInterval(interval) {
    currentRefreshInterval = interval;
    
    // 清除现有的定时器
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
    }
    
    // 设置新的定时器
    refreshIntervalId = setInterval(refreshData, currentRefreshInterval);
    
    // 更新设置页面中的选择器值
    const refreshIntervalSelect = document.getElementById('refreshInterval');
    if (refreshIntervalSelect) {
        refreshIntervalSelect.value = interval;
    }
}

/**
 * 全屏查看图表
 * @param {string} chartId - 图表ID
 */
function toggleFullscreen(chartId) {
    const chartContainer = document.getElementById(chartId).closest('.card');
    if (!chartContainer) return;
    
    if (!document.fullscreenElement) {
        chartContainer.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

/**
 * 切换整个仪表盘的全屏模式
 */
function toggleFullscreenDashboard() {
    const container = document.querySelector('.container');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.fullscreenElement) {
        // 进入全屏模式
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        
        // 更新按钮图标
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
        fullscreenBtn.title = '退出全屏';
    } else {
        // 退出全屏模式
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // 更新按钮图标
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        fullscreenBtn.title = '切换全屏';
    }
}

// 监听全屏变化事件
document.addEventListener('fullscreenchange', function() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.fullscreenElement) {
        // 退出全屏模式
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        fullscreenBtn.title = '切换全屏';
    }
});

document.addEventListener('webkitfullscreenchange', function() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.webkitFullscreenElement) {
        // 退出全屏模式
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        fullscreenBtn.title = '切换全屏';
    }
});

document.addEventListener('msfullscreenchange', function() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.msFullscreenElement) {
        // 退出全屏模式
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        fullscreenBtn.title = '切换全屏';
    }
});

/**
 * 导出图表数据
 * @param {string} chartId - 图表ID
 */
function exportChartData(chartId) {
    const chart = getChartInstance(chartId);
    if (!chart) return;
    
    // 这里可以添加导出数据的逻辑
    const data = chart.data;
    console.log('Exporting chart data:', data);
    
    // 简单实现：将数据转换为JSON并下载
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartId}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * 获取图表实例
 * @param {string} chartId - 图表ID
 * @returns {Chart} 图表实例
 */
function getChartInstance(chartId) {
    switch (chartId) {
        case 'visitChart':
            return visitChart;
        case 'sourceChart':
            return sourceChart;
        case 'regionChart':
            return regionChart;
        case 'salesChart':
            return salesChart;
        default:
            return null;
    }
}

/**
 * 页面切换功能
 * @param {string} pageId - 要显示的页面ID
 */
function switchPage(pageId) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // 初始化对应的图表
        if (pageId === 'user-analysis-page') {
            initUserAnalysisCharts();
        } else if (pageId === 'sales-data-page') {
            initSalesDataCharts();
        }
    }
    
    // 调整图表大小
    resizeCharts();
}

/**
 * 初始化用户分析页面图表
 */
function initUserAnalysisCharts() {
    // 初始化用户增长趋势图
    const userGrowthChart = document.getElementById('userGrowthChart');
    if (!userGrowthChart.getAttribute('data-initialized')) {
        const ctx = userGrowthChart.getContext('2d');
        // 生成近7天日期标签
        const labels = generateLast7Days();
        // 生成随机数据
        const data = generateRandomData(7, 100, 500);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{"label": "新增用户","data": data,"borderColor": "#4fc3f7","backgroundColor": "rgba(79, 195, 247, 0.2)","borderWidth": 3,"fill": true,"tension": 0.4}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {"display": false},
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    }
                }
            }
        });
        
        userGrowthChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化用户性别分布饼图
    const genderChart = document.getElementById('genderChart');
    if (!genderChart.getAttribute('data-initialized')) {
        const ctx = genderChart.getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["男","女","未知"],
                datasets: [{"data": [55,40,5],"backgroundColor": ["#4fc3f7","#e91e63","#9575cd"],"borderColor": "#1a1f3a","borderWidth": 3}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "rgba(255, 255, 255, 0.9)"
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                }
            }
        });
        
        genderChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化用户年龄分布柱状图
    const ageChart = document.getElementById('ageChart');
    if (!ageChart.getAttribute('data-initialized')) {
        const ctx = ageChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["18-25","26-35","36-45","46-55","55+"],
                datasets: [{"label": "用户数量","data": [300,500,400,200,100],"backgroundColor": ["#4fc3f7","#64b5f6","#81c784","#a5d6a7","#ffb74d"],"borderColor": "#1a1f3a","borderWidth": 3,"borderRadius": 8}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {"display": false},
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    }
                }
            }
        });
        
        ageChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化用户活跃度分析图
    const activityChart = document.getElementById('activityChart');
    if (!activityChart.getAttribute('data-initialized')) {
        const ctx = activityChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["周一","周二","周三","周四","周五","周六","周日"],
                datasets: [{"label": "活跃用户","data": [800,900,700,1000,1200,1500,1300],"borderColor": "#81c784","backgroundColor": "rgba(129, 199, 132, 0.2)","borderWidth": 3,"fill": true,"tension": 0.4}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {"display": false},
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    }
                }
            }
        });
        
        activityChart.setAttribute('data-initialized', 'true');
    }
}

/**
 * 初始化销售数据页面图表
 */
function initSalesDataCharts() {
    // 初始化销售趋势图
    const salesTrendChart = document.getElementById('salesTrendChart');
    if (!salesTrendChart.getAttribute('data-initialized')) {
        const ctx = salesTrendChart.getContext('2d');
        // 生成近7天日期标签
        const labels = generateLast7Days();
        // 生成随机数据
        const data = generateRandomData(7, 100000, 500000);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{"label": "销售额","data": data,"borderColor": "#4fc3f7","backgroundColor": "rgba(79, 195, 247, 0.2)","borderWidth": 3,"fill": true,"tension": 0.4}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {"display": false},
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)",
                            callback: function(value) {
                                return `¥${formatNumber(value)}`;
                            }
                        }
                    }
                }
            }
        });
        
        salesTrendChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化产品销售分布图
    const productChart = document.getElementById('productChart');
    if (!productChart.getAttribute('data-initialized')) {
        const ctx = productChart.getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["产品A","产品B","产品C","产品D","产品E"],
                datasets: [{"data": [35,25,20,15,5],"backgroundColor": ["#4fc3f7","#81c784","#ffb74d","#e91e63","#9575cd"],"borderColor": "#1a1f3a","borderWidth": 3}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "rgba(255, 255, 255, 0.9)"
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                }
            }
        });
        
        productChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化区域销售对比图
    const regionSalesChart = document.getElementById('regionSalesChart');
    if (!regionSalesChart.getAttribute('data-initialized')) {
        const ctx = regionSalesChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["北京","上海","广州","深圳","杭州"],
                datasets: [{"label": "销售额","data": [500000,450000,400000,350000,300000],"backgroundColor": ["#4fc3f7","#64b5f6","#90caf9","#bbdefb","#e3f2fd"],"borderColor": "#1a1f3a","borderWidth": 3,"borderRadius": 8}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {"display": false},
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)"
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.05)","drawBorder": false
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)",
                            callback: function(value) {
                                return `¥${formatNumber(value)}`;
                            }
                        }
                    }
                }
            }
        });
        
        regionSalesChart.setAttribute('data-initialized', 'true');
    }
    
    // 初始化销售渠道分析图
    const channelChart = document.getElementById('channelChart');
    if (!channelChart.getAttribute('data-initialized')) {
        const ctx = channelChart.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["线上商城","线下门店","第三方平台","微信小程序","其他"],
                datasets: [{"data": [40,25,20,10,5],"backgroundColor": ["#4fc3f7","#81c784","#ffb74d","#e91e63","#9575cd"],"borderColor": "#1a1f3a","borderWidth": 3}
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "rgba(255, 255, 255, 0.9)"
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(10, 14, 39, 0.95)","titleColor": "#e0f7fa","bodyColor": "#ffffff","borderColor": "#4fc3f7","borderWidth": 2,"padding": 15,"cornerRadius": 12
                    }
                }
            }
        });
        
        channelChart.setAttribute('data-initialized', 'true');
    }
}

/**
 * 动态调整图表大小
 */
function resizeCharts() {
    if (visitChart) visitChart.resize();
    if (sourceChart) sourceChart.resize();
    if (regionChart) regionChart.resize();
    if (salesChart) salesChart.resize();
    
    // 调整其他页面的图表大小
    const allCharts = Chart.instances;
    for (const chartId in allCharts) {
        if (allCharts.hasOwnProperty(chartId)) {
            allCharts[chartId].resize();
        }
    }
}

// 监听窗口大小变化，调整图表大小
window.addEventListener('resize', resizeCharts);
