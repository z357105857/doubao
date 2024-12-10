// 轮播图初始化
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// 音乐播放器
const audioPlayer = document.getElementById('audio-player');
const playlistItems = document.querySelectorAll('.playlist-item');

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

// 加载动画
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('fade-out');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// 图片预加载
function preloadImages() {
    const images = [
        'images/artwork1.jpg',
        'images/artwork2.jpg',
        'images/artwork3.jpg',
        'images/artwork4.jpg',
        'images/game1.jpg',
        'images/game2.jpg',
        'images/game3.jpg',
        'images/xhs1.jpg',
        'images/xhs2.jpg',
        'images/xhs3.jpg',
        'images/wechat.png',
        'images/douyin.png',
        'images/xiaohongshu.png'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// 在页面加载时调用预加载函数
window.addEventListener('DOMContentLoaded', preloadImages);

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