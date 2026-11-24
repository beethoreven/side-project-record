(function () {
  var body = document.body;
  var tabs = document.querySelectorAll('.switch button');
  function setLang(lang, updateHash) {
    body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    tabs.forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-set') === lang ? 'true' : 'false');
    });
    if (updateHash) {
      try { history.replaceState(null, '', '#' + lang); } catch (e) {}
    }
  }
  tabs.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set'), true); });
  });
  var h = (location.hash || '').replace('#', '');
  setLang(h === 'zh' ? 'zh' : 'en', false);

  /* screenshot zoom */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<img alt=""><button type="button" class="close">Close ✕</button>';
  document.body.appendChild(box);
  var bigImg = box.querySelector('img');
  var closeBtn = box.querySelector('.close');
  var opener = null;
  function openZoom(img) {
    opener = img;
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt;
    box.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeZoom() {
    box.hidden = true;
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }
  document.querySelectorAll('.shot img').forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', img.alt + ' (click to enlarge)');
    img.addEventListener('click', function () { openZoom(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(img); }
    });
    var hint = document.createElement('span');
    hint.className = 'zoom-hint';
    hint.innerHTML = '<span class="en" lang="en">Enlarge</span><span class="zh" lang="zh">放大</span><span aria-hidden="true">⤢</span>';
    img.parentNode.appendChild(hint);
  });
  box.addEventListener('click', function (e) { if (e.target !== closeBtn) closeZoom(); });
  closeBtn.addEventListener('click', closeZoom);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeZoom(); });
})();
