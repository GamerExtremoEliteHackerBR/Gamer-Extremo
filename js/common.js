// ===== TROCA DE IDIOMA =====
function setPolicyLang(lang) {
    const pt = document.getElementById('policy-pt');
    const en = document.getElementById('policy-en');
    const btnPt = document.getElementById('btn-pt');
    const btnEn = document.getElementById('btn-en');
    const label = document.getElementById('current-lang-label');

    if (!pt || !en) return;

    if (lang === 'pt') {
        pt.classList.add('active');
        en.classList.remove('active');
        btnPt.classList.add('active');
        btnEn.classList.remove('active');
        if (label) label.textContent = 'Português (BR)';
        document.documentElement.lang = 'pt-br';
    } else {
        en.classList.add('active');
        pt.classList.remove('active');
        btnEn.classList.add('active');
        btnPt.classList.remove('active');
        if (label) label.textContent = 'English (US)';
        document.documentElement.lang = 'en';
    }

    try { localStorage.setItem('policyLang', lang); } catch (e) {}
    history.replaceState(null, '', '#' + lang);
}

// ===== LIGHTBOX DE SCREENSHOTS =====
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
    // Cria o lightbox no body
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.innerHTML = `
        <button class="close" aria-label="Fechar">&times;</button>
        <button class="nav prev" aria-label="Anterior">&#10094;</button>
        <img src="" alt="Screenshot ampliado">
        <button class="nav next" aria-label="Próximo">&#10095;</button>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.close').addEventListener('click', closeLightbox);
    lb.querySelector('.prev').addEventListener('click', () => navigateLightbox(-1));
    lb.querySelector('.next').addEventListener('click', () => navigateLightbox(1));
    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Liga todos os screenshots da página
    const shots = document.querySelectorAll('.screenshot img');
    lightboxImages = Array.from(shots).map(img => img.src);

    shots.forEach((img, i) => {
        img.parentElement.addEventListener('click', () => openLightbox(i));
    });
}

function openLightbox(index) {
    const lb = document.getElementById('lightbox');
    if (!lb || lightboxImages.length === 0) return;
    lightboxIndex = index;
    lb.querySelector('img').src = lightboxImages[lightboxIndex];
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    if (lightboxImages.length === 0) return;
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    const lb = document.getElementById('lightbox');
    lb.querySelector('img').src = lightboxImages[lightboxIndex];
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
    // Restaura idioma salvo (se estiver numa página de política)
    const hash = window.location.hash.replace('#', '');
    let saved = hash;
    if (!saved) {
        try { saved = localStorage.getItem('policyLang'); } catch (e) {}
    }
    if ((saved === 'pt' || saved === 'en') && document.getElementById('policy-pt')) {
        setPolicyLang(saved);
    }

    // Inicializa lightbox (se houver screenshots na página)
    if (document.querySelector('.screenshot')) {
        initLightbox();
    }
});