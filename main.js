document.addEventListener('DOMContentLoaded', function() {
    // 音乐播放器
    const audioPlayer = document.getElementById('audio-player');
    const playlistItems = document.querySelectorAll('.playlist-item');

    // 设置第一首歌为激活状态
    if (playlistItems.length > 0) {
        playlistItems[0].classList.add('active');
    }

    // 页面加载完成后自动播放
    window.addEventListener('load', function() {
        // 尝试自动播放
        audioPlayer.play().catch(error => {
            console.log('自动播放失败，需要用户交互:', error);
            // 如果自动播放失败，监听用户的第一次点击事件
            document.addEventListener('click', function startAudio() {
                audioPlayer.play();
                document.removeEventListener('click', startAudio);
            }, { once: true });
        });
    });

    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            playlistItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const src = this.getAttribute('data-src');
            audioPlayer.src = src;
            audioPlayer.play();
        });
    });

    // 自动播放下一首
    audioPlayer.addEventListener('ended', function() {
        const currentItem = document.querySelector('.playlist-item.active');
        const nextItem = currentItem.nextElementSibling;
        
        if (nextItem) {
            nextItem.click();
        } else {
            playlistItems[0].click();
        }
    });

    // 画作弹窗
    const modal = document.querySelector('.modal');
    const modalImg = modal.querySelector('img');
    const closeButton = modal.querySelector('.close-button');
    const artworkCards = document.querySelectorAll('.artwork-card');

    artworkCards.forEach(card => {
        card.addEventListener('click', () => {
            const imageSrc = card.getAttribute('data-image');
            modalImg.src = imageSrc;
            modal.classList.add('active');
        });
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 获取导航栏高度
                const navHeight = document.querySelector('.header').offsetHeight;
                
                // 获取目标元素的位置
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // 滚动到目标位置，考虑导航栏高度
                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
                
                // 更新 URL
                history.pushState(null, '', targetId);
            }
        });
    });

    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 加载动
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        requestAnimationFrame(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        });
    });

    // 图片预加载
    function preloadImages() {
        // 只预加载首屏关键图片
        const criticalImages = [
            'images/dbLogo.png',
            'images/slides/轮播图1.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    window.addEventListener('load', preloadImages);

    // 页面加载时检查 URL 中的锚点
    window.addEventListener('load', () => {
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                setTimeout(() => {
                    const navHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition - navHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });

    // 添加页面滚动监听，显示动画
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 导航栏激活状态
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-item a');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // 小红书 iframe 加载处理
    const xhsIframe = document.querySelector('.xhs-iframe');
    if (xhsIframe) {
        xhsIframe.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    }

    // 游戏链接处理
    const gameLinks = document.querySelectorAll('.game-link');
    
    gameLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const gameUrl = this.getAttribute('href');
            window.open(gameUrl, '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
        });
    });
});