document.addEventListener('DOMContentLoaded', function() {
    // 缓存常用DOM元素
    const elements = {
        audioPlayer: document.getElementById('audio-player'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        modal: document.querySelector('.modal'),
        modalImg: document.querySelector('.modal img'),
        closeButton: document.querySelector('.close-button'),
        artworkCards: document.querySelectorAll('.artwork-card'),
        backToTop: document.querySelector('.back-to-top'),
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.querySelector('#themeToggle i'),
        navLinks: document.querySelectorAll('.nav-item a'),
        sections: document.querySelectorAll('section[id]'),
        gameLinks: document.querySelectorAll('.game-link')
    };

    // 主题切换功能
    const themeManager = {
        init() {
            // 设置初始主题
            this.setAutoTheme();
            
            // 每分钟检查一次时间
            setInterval(() => this.setAutoTheme(), 60000);

            // 添加主题切换事件监听
            elements.themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                localStorage.setItem('userSetTheme', 'true');
                this.updateThemeIcon(newTheme);
            });
        },

        updateThemeIcon(theme) {
            elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        },

        setAutoTheme() {
            // 如果用户手动设置过主题，则不自动切换
            if (localStorage.getItem('userSetTheme')) {
                return;
            }
            
            const hour = new Date().getHours();
            const theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeIcon(theme);
            localStorage.setItem('theme', theme);
        },
        
        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeIcon(theme);
            localStorage.setItem('theme', theme);
        }
    };

    // 工具函数
    const utils = {
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        },
        
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        updateBackToTop: () => {
            if (window.scrollY > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        }
    };

    // 事件处理函数
    const handlers = {
        handlePlaylistClick: (item) => {
            elements.playlistItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const src = item.getAttribute('data-src');
            elements.audioPlayer.src = src;
            elements.audioPlayer.play();
        },
        
        handleArtworkClick: (card) => {
            const imageSrc = card.getAttribute('data-image');
            elements.modalImg.src = imageSrc;
            elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';  // 禁止背景滚动
        },
        
        handleModalClose: () => {
            elements.modal.classList.remove('active');
            elements.modalImg.src = '';
            document.body.style.overflow = '';  // 恢复背景滚动
        },
        
        handleGameClick: (link) => {
            const gameUrl = link.getAttribute('href');
            window.open(gameUrl, '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
        }
    };

    // 性能监控
    const performance = {
        logTiming: () => {
            if (window.performance) {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`页面加载时间: ${loadTime}ms`);
            }
        },
        
        observeElements: () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            });
            
            elements.sections.forEach(section => observer.observe(section));
        }
    };

    // 事件委托
    document.addEventListener('click', (e) => {
        const playlistItem = e.target.closest('.playlist-item');
        const artworkCard = e.target.closest('.artwork-card');
        const gameLink = e.target.closest('.game-link');
        
        if (playlistItem) handlers.handlePlaylistClick(playlistItem);
        if (artworkCard) handlers.handleArtworkClick(artworkCard);
        if (e.target.classList.contains('modal') || e.target.classList.contains('close-button')) {
            handlers.handleModalClose();
        }
        if (gameLink) {
            e.preventDefault();
            handlers.handleGameClick(gameLink);
        }
    });

    // 添加 ESC 键关闭功能
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            handlers.handleModalClose();
        }
    });

    // 优化滚动事件处理
    window.addEventListener('scroll', utils.throttle(() => {
        updateActiveNav();
        utils.updateBackToTop();
    }, 100));

    // 初始化
    const init = () => {
        if (elements.playlistItems.length > 0) {
            elements.playlistItems[0].classList.add('active');
        }
        
        // 初始化主题管理器
        themeManager.init();
        
        performance.observeElements();
        lazyLoadImages();
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initNonCriticalFeatures);
        } else {
            setTimeout(initNonCriticalFeatures, 200);
        }
    };

    // 启动应用
    init();

    // 资源加载管理
    const resourceLoader = {
        // 非关键资源列表
        nonCriticalResources: [
            { type: 'style', url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' },
            { type: 'script', url: 'path/to/analytics.js' }
        ],
  
        // 加载单个资源
        loadResource(resource) {
            return new Promise((resolve, reject) => {
                try {
                    if (resource.type === 'style') {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = resource.url;
                        link.onload = resolve;
                        link.onerror = reject;
                        document.head.appendChild(link);
                    } else if (resource.type === 'script') {
                        const script = document.createElement('script');
                        script.src = resource.url;
                        script.async = true;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },
  
        // 加载所有非关键资源
        loadAll() {
            const loadPromises = this.nonCriticalResources.map(resource => 
                this.loadResource(resource)
                    .catch(error => console.warn(`Failed to load ${resource.url}:`, error))
            );
            
            return Promise.all(loadPromises);
        }
    };

    // 使用 requestIdleCallback 延迟加载非关键资源
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resourceLoader.loadAll());
    } else {
        setTimeout(() => resourceLoader.loadAll(), 1000);
    }

    // 防止图片点击关闭
    elements.modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});