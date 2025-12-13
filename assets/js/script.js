// script.js
// بسيط: تهيئة AOS (تم تهيئته أيضاً في index.html)، وإضافة تفاعل صغير للـ link-item (ripple / keyboard focus)

document.addEventListener('DOMContentLoaded', function () {
  // keyboard focus style support (adds :focus-visible like behavior)
  document.querySelectorAll('.link-item').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // emulate click on Enter/Space
        item.click();
      }
    });
  });

  // small ripple effect on click for link items
  document.querySelectorAll('.link-item').forEach(item => {
    item.style.position = 'relative';
    item.addEventListener('click', function (ev) {
      const circle = document.createElement('span');
      circle.style.position = 'absolute';
      circle.style.background = 'rgba(255,255,255,0.25)';
      circle.style.borderRadius = '50%';
      circle.style.transform = 'scale(0)';
      circle.style.pointerEvents = 'none';
      circle.style.width = circle.style.height = '120px';
      circle.style.left = (ev.offsetX - 60) + 'px';
      circle.style.top = (ev.offsetY - 60) + 'px';
      circle.style.opacity = '0.9';
      circle.style.transition = 'transform 600ms ease, opacity 600ms ease';
      this.appendChild(circle);
      requestAnimationFrame(() => { circle.style.transform = 'scale(1)'; circle.style.opacity = '0'; });
      setTimeout(() => circle.remove(), 650);
    });
  });
});
