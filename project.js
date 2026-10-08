(() => {
  const projects = window.UZHVE_PROJECTS;
  const id = new URLSearchParams(location.search).get('id');
  const index = projects.findIndex(project => project.id === id);
  if (index < 0) {
    document.title = 'Проект не найден | Константин Ужве';
    const article = document.querySelector('#project-content');
    article.className = 'not-found';
    article.innerHTML = '<h1>Проект не найден</h1><p>Выберите проект на <a class="underlined" href="/#projects">главной странице</a>.</p>';
    return;
  }
  const project = projects[index];
  const imageSizes={
    'stairs-dome':[483,613],'stairs-installation':[460,613],
    'stairs-dome-original':[1800,2400],'stairs-installation-original':[1800,2400],
    'house-cover':[2400,1800],'apostle-cover':[2400,1800],
    'boundless-exhibition':[617,530],'boundless-detail':[564,547],
    comet:[533,426],arrow:[532,426],sisters:[533,426],drone:[532,426],after:[1484,728],
    'second-life-exhibition':[1127,880],'1730':[510,880],'olympic-ghost':[554,880],
    pioneers:[700,878],'red-hand':[620,878],away:[518,876],neva:[520,878],
    house:[1080,1080],'house-side':[1080,1080],'house-window':[1080,1080],
    'house-before':[1080,1080],'house-process':[1080,1080],
    'mayakovsky-exhibition':[620,880],mayakovsky:[620,880],puppies:[922,880],browning:[950,880],
    'apostle-exhibition':[940,1080],'flame-untitled':[660,878],'last-lights-out':[620,878],'red-carpet':[1280,878]
  };
  const setImageSize=(image,name)=>{
    const size=name.startsWith('carbon-')?[1350,1800]:name.startsWith('tpaf-photo-')?[600,800]:imageSizes[name];
    if(size){image.width=size[0];image.height=size[1];}
  };
  document.title = `${project.title} | Константин Ужве`;
  document.querySelector('meta[name="description"]').content = `${project.title}. ${project.media}. Константин Ужве. ${project.text[0]}`;
  document.querySelector('#project-title').textContent = project.title;
  const meta = document.querySelector('#project-meta');
  [project.media, project.place, project.year].filter(Boolean).forEach(value => {
    const line = document.createElement('span');line.textContent=value;meta.append(line);
  });
  const cover = document.createElement('img');
  const coverName = project.id === 'carbon' ? 'carbon-video-poster' : project.cover;
  cover.src = `assets/works/${coverName}.jpg`;cover.alt = project.title;cover.fetchPriority='high';
  setImageSize(cover,coverName);
  if (project.id === 'carbon') {cover.width=1280;cover.height=720;}
  const coverFigure = document.querySelector('#project-cover');
  coverFigure.append(cover);
  if (project.id === 'stairs' || project.coverPair) {
    coverFigure.classList.add('cover-pair');
    const secondName=project.coverPair||'stairs-installation-original';
    const second = document.createElement('img');second.src=`assets/works/${secondName}.jpg`;second.alt=project.id==='stairs'?'Лестницы. Общий вид инсталляции':`${project.title}. Другой вид экспозиции`;setImageSize(second,secondName);coverFigure.append(second);
  }
  project.text.forEach(text => {const paragraph=document.createElement('p');paragraph.textContent=text;document.querySelector('#project-text').append(paragraph);});
  const fields = [
    ['Название',project.title],
    ['Год',project.year],['Тип проекта',project.media],
    ['Материалы',project.materials],['Место',project.place],
    ['Размеры',project.dimensions],['Куратор',project.curator],
    ['Даты выставки',project.dates]
  ];
  fields.filter(([,value])=>value).forEach(([label,value])=>{
    const field=document.createElement('div');
    const term=document.createElement('dt');term.textContent=label;
    const description=document.createElement('dd');description.textContent=value;
    field.append(term,description);document.querySelector('#project-record').append(field);
  });
  if(project.publication){
    const section=document.createElement('div');section.className='project-reading';
    const link=document.createElement('a');link.href=project.publication;link.target='_blank';link.rel='noopener';link.className='underlined';link.textContent='Кураторский текст';
    const credit=document.createElement('p');credit.textContent='Александр Дашевский / Вторая жизнь Ужве';
    section.append(link,credit);document.querySelector('#project-gallery').before(section);
  }
  [project.video,project.talk].filter(Boolean).forEach(media => {
    const section=document.createElement('section');section.className='project-video' + (media === project.talk ? ' project-talk' : '');
    if(media === project.talk)section.id='artist-talk';
    const title=document.createElement('h2');title.textContent=media.title;
    const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';
    video.poster=media.poster;video.setAttribute('aria-label',media.title);
    video.width=media.width || (media === project.talk ? 720 : 1280);video.height=media.height || (media === project.talk ? 1280 : 720);
    if(video.height>video.width)section.classList.add('project-video-portrait');
    const source=document.createElement('source');source.src=media.src;source.type='video/mp4';
    const fallback=document.createElement('a');fallback.href=media.src;fallback.textContent='Открыть видео';
    video.append(source,fallback);
    const caption=document.createElement('p');caption.textContent=media.caption;
    if(media===project.talk){
      const copy=document.createElement('div');copy.className='project-talk-copy';copy.append(title,caption);section.append(copy,video);
    }else section.append(title,video,caption);
    document.querySelector('#project-gallery').before(section);
  });
  let galleryTarget=document.querySelector('#project-gallery');
  if(project.id==='carbon')galleryTarget.classList.add('archive-card-grid');
  project.gallery.forEach(item => {
    if(item.section){
      const section=document.createElement('section');section.className='gallery-series-item';
      if(item.section.id)section.id=item.section.id;
      const copy=document.createElement('div');copy.className='gallery-series-copy';
      const title=document.createElement('h2');title.textContent=item.section.title;copy.append(title);
      if(item.section.details){const details=document.createElement('p');details.className='gallery-series-details';details.textContent=item.section.details;copy.append(details);}
      (item.section.description||[]).forEach(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;copy.append(paragraph);});
      if(item.section.poem){const poem=document.createElement('p');poem.className='gallery-series-poem';poem.textContent=item.section.poem;copy.append(poem);}
      galleryTarget=document.createElement('div');galleryTarget.className='gallery-series-media'+(item.section.imageCount===1?' gallery-series-solo':'');
      section.append(copy,galleryTarget);document.querySelector('#project-gallery').append(section);
    }
    const figure=document.createElement('figure');
    if(item.full)figure.className='full';
    const button=document.createElement('button');button.className='gallery-button';
    button.dataset.lightbox=`assets/works/${item.image}.jpg`;button.dataset.caption=item.caption;
    button.setAttribute('aria-label',`Увеличить: ${item.caption}`);
    const image=document.createElement('img');image.src=button.dataset.lightbox;image.alt=item.caption;image.loading='lazy';
    setImageSize(image,item.image);
    if(item.width&&item.height){image.width=item.width;image.height=item.height;}
    button.append(image);
    const caption=document.createElement('figcaption');caption.textContent=item.view||item.caption;
    figure.append(button,caption);galleryTarget.append(figure);
  });
  const next=projects[(index+1)%projects.length];
  const nextLink=document.querySelector('#next-project');nextLink.textContent=next.title;nextLink.href=`project.html?id=${next.id}`;
  const anchor=location.hash?document.getElementById(location.hash.slice(1)):null;
  if(anchor)requestAnimationFrame(()=>anchor.scrollIntoView({block:'start',behavior:'instant'}));
})();
