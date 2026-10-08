(() => {
  // Preserve links shared while the portfolio was one long page.
  if (!location.pathname.endsWith('artist.html') && /(?:\/|index\.html)$/.test(location.pathname)) {
    const section = location.hash.slice(1);
    if (['about', 'statement', 'cv', 'publications', 'mosya'].includes(section) && !document.getElementById(section)) {
      location.replace('artist.html#' + section);
      return;
    }
    if (section === 'contact') { location.replace('contact.html'); return; }
  }

  const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.menu-toggle');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const brand = document.querySelector('.site-name');
  const desktopNav = document.querySelector('.desktop-nav');
  for(const nav of [desktopNav,menu?.querySelector('.menu-links')]){
    if(!nav||nav.querySelector('a[href="texts.html"]'))continue;
    const link=document.createElement('a');link.href='texts.html';link.textContent='Тексты';
    const after=nav.querySelector('a[href="works.html"]');after?.after(link);
  }
  const mobile = matchMedia('(max-width:767px)');
  const setMenu = (open, restoreFocus = true) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    main.inert = open; footer.inert = open; desktopNav.inert = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Закрыть' : 'Меню';
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a').focus({preventScroll:true});
    else if (restoreFocus) toggle.focus({preventScroll:true});
  };
  toggle?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, false)));
  mobile.addEventListener('change', () => { if (!mobile.matches) setMenu(false, false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.nav-more[open]').forEach(item => item.open = false);
    if (!menu?.classList.contains('is-open')) return;
    if (event.key === 'Escape') setMenu(false);
    if (event.key !== 'Tab') return;
    const focusable = [brand, toggle, ...menu.querySelectorAll('a')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav-more[open]').forEach(item => {
      if (!item.contains(event.target)) item.open = false;
    });
  });

  const openDisclosure = () => {
    const id = location.hash.slice(1);
    const disclosure = id ? document.getElementById(id) : null;
    if (disclosure?.matches('.artist-disclosure')) {
      disclosure.open = true;
      requestAnimationFrame(() => disclosure.scrollIntoView({block:'start', behavior:'instant'}));
    }
  };
  openDisclosure();
  addEventListener('hashchange', openDisclosure);
  document.querySelectorAll('.artist-disclosure').forEach(disclosure => {
    disclosure.addEventListener('toggle', () => {
      if (!disclosure.open && location.hash === '#' + disclosure.id) history.replaceState(null, '', location.pathname);
    });
  });

  const dialog = document.querySelector('.lightbox');
  if (dialog) {
    const image = document.createElement('img');
    image.draggable = false;
    let trigger, items = [], active = 0, touchStart;
    const controls = document.createElement('div');
    controls.className = 'lightbox-navigation';
    const makeArrow = (direction, label) => {
      const button = document.createElement('button');
      button.type = 'button';button.className = 'lightbox-arrow';button.setAttribute('aria-label', label);
      const icon = document.createElement('img');icon.src = 'assets/vendor/icons/caret-' + direction + '.svg';icon.alt = '';icon.width = 24;icon.height = 24;
      button.append(icon);return button;
    };
    const previous = makeArrow('left', 'Предыдущее фото');
    const next = makeArrow('right', 'Следующее фото');
    const count = document.createElement('span');count.className = 'lightbox-count';count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');
    controls.append(previous,count,next);
    dialog.querySelector('.lightbox-caption').after(controls);
    const showImage = index => {
      active = (index + items.length) % items.length;
      const item = items[active];
      image.src = item.dataset.lightbox;image.alt = item.dataset.caption || '';
      dialog.querySelector('.lightbox-caption').textContent = image.alt;
      count.textContent = (active + 1) + ' / ' + items.length;
      count.setAttribute('aria-label', 'Фото ' + (active + 1) + ' из ' + items.length);
      controls.hidden = items.length < 2;
    };
    document.addEventListener('click', event => {
      const clicked = event.target.closest('[data-lightbox]');
      if (!clicked) return;
      trigger = clicked;
      items = Array.from((clicked.closest('.project-gallery,.artwork-grid') || main).querySelectorAll('[data-lightbox]')).filter(item => !item.closest('[hidden]'));
      dialog.querySelector('.lightbox-media').replaceChildren(image);
      showImage(items.indexOf(clicked));
      dialog.showModal();
      document.body.classList.add('lightbox-open');
    });
    previous.addEventListener('click', () => showImage(active - 1));
    next.addEventListener('click', () => showImage(active + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();showImage(active + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    image.addEventListener('pointerdown', event => {
      if(event.pointerType === 'touch')touchStart = {x:event.clientX,y:event.clientY};
    });
    image.addEventListener('pointerup', event => {
      if(!touchStart)return;
      const x=event.clientX-touchStart.x,y=event.clientY-touchStart.y;
      touchStart=undefined;
      if(Math.abs(x)>48 && Math.abs(x)>Math.abs(y)*1.5)showImage(active + (x<0?1:-1));
    });
    image.addEventListener('pointercancel', () => touchStart=undefined);
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      trigger?.focus({preventScroll:true});
    });
  }


  document.querySelectorAll('.desktop-nav > a').forEach(link => {
    if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current','page');
  });

  // One batched scroll source drives navigation visibility; the logo stays static.
  const header = document.querySelector('.site-header');
  let previousY = -1, idleTimer, stopScroll;
  // Sample only local media, at idle. No outline or panel over the artwork.
  const thumbnails = new WeakMap();
  const posterImages = new WeakMap();
  const media = Array.from(document.querySelectorAll('main img,main video'));
  const navigationColor = () => {
    header?.querySelectorAll('.site-name,.desktop-nav > a,.nav-more > summary,.menu-toggle').forEach(link => {
      if(document.body.classList.contains('menu-open')){link.style.color='';return;}
      const box=link.getBoundingClientRect();let sum=0,samples=0;
      for(const position of [.2,.5,.8]){
        const x=box.left+box.width*position,y=box.top+box.height/2;
        const underlying=media.find(item=>{const r=item.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;});
        let luminance=1;
        if(underlying){
          let pixels=thumbnails.get(underlying);
          if(!pixels){
            let source=underlying;
            if(underlying.tagName==='VIDEO'){
              source=posterImages.get(underlying);
              if(!source){source=new Image();source.src=underlying.poster;posterImages.set(underlying,source);source.addEventListener('load',navigationColor,{once:true});}
            }
            if(source.complete&&source.naturalWidth){
              const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
              const context=canvas.getContext('2d',{willReadFrequently:true});
              try{context.drawImage(source,0,0,64,64);pixels=context.getImageData(0,0,64,64).data;thumbnails.set(underlying,pixels);}catch{}
            }
          }
          if(pixels){
            const r=underlying.getBoundingClientRect();const pixel=(Math.min(63,Math.floor((y-r.top)/r.height*64))*64+Math.min(63,Math.floor((x-r.left)/r.width*64)))*4;
            const linear=value=>{value/=255;return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;};
            luminance=.2126*linear(pixels[pixel])+.7152*linear(pixels[pixel+1])+.0722*linear(pixels[pixel+2]);
          }
        }
        sum+=luminance;samples++;
      }
      link.style.color=sum/samples<.18?'#ffffff':'';
    });
  };
  const revealNavigation = () => {header?.classList.remove('is-scrolling');navigationColor();};
  const trackScrolling = () => {
    stopScroll?.();
    if (!window.UzhveMotion?.scroll) return;
    stopScroll = UzhveMotion.scroll((_progress, info) => {
      const y = info.y.current;
      if (previousY >= 0 && Math.abs(y - previousY) > .5) {
        const protectedState = header?.contains(document.activeElement) || header?.matches(':hover') || menu?.classList.contains('is-open') || document.querySelector('.nav-more[open]') || document.querySelector('dialog[open]');
        if (y > 16 && !protectedState) header?.classList.add('is-scrolling');
        else revealNavigation();
        clearTimeout(idleTimer);
        idleTimer = setTimeout(revealNavigation, 650);
      }
      previousY = y;
    }, {trackContentSize:true});
  };
  header?.addEventListener('pointerenter', revealNavigation);
  header?.addEventListener('focusin', revealNavigation);
  document.querySelectorAll('.nav-more').forEach(item => item.addEventListener('toggle', revealNavigation));
  addEventListener('resize', navigationColor);
  addEventListener('pagehide', () => {stopScroll?.();clearTimeout(idleTimer);revealNavigation();});
  addEventListener('pageshow', trackScrolling);
  navigationColor();
  trackScrolling();
})();
