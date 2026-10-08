(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const arrow=(direction,label)=>{
    const button=document.createElement('button');button.type='button';button.className='carousel-arrow';button.setAttribute('aria-label',label);
    const icon=document.createElement('img');icon.src=`assets/vendor/icons/caret-${direction}.svg`;icon.alt='';icon.width=20;icon.height=20;button.append(icon);return button;
  };
  const definitions=[
    {selector:'.selected-house .project-media-link',title:'Дом №40',href:'project.html?id=dom',slides:[
      [['house-cover','Дом №40. Общий вид']],
      [['house-photo-03','Дом №40. Дневной свет']],
      [['house-photo-04','Дом №40. Вид сбоку']],
      [['house-photo-07','Дом №40. Окна со щитами']]
    ]},
    {selector:'.selected-stairs .project-photo-pair',title:'Лестницы',href:'project.html?id=stairs',pair:true,slides:[
      [['stairs-dome-original','Лестницы. Под куполом'],['stairs-installation-original','Лестницы. Общий вид']],
      [['stairs-photo-06','Лестницы. Дневной свет'],['stairs-photo-08','Лестницы. Вид снизу']],
      [['stairs-photo-15','Лестницы. Вечерний свет'],['stairs-photo-17','Лестницы. Пространство инсталляции']]
    ]},
    {selector:'.selected-second .project-media-link',title:'Вторая жизнь Ужве',href:'project.html?id=nenemu',slides:[
      [['second-life-exhibition','Вторая жизнь Ужве. Экспозиция']],
      [['secondlife-photo-14','Время Личной Гигиены Мозга']],
      [['1730','17:30'],['ashes','Из пламени в пепел']],
      [['secondlife-photo-13','Призрак олимпиады'],['secondlife-photo-15','Последний акт']]
    ]}
  ];
  for(const definition of definitions){
    const original=document.querySelector(definition.selector);if(!original)continue;
    const root=document.createElement('section');root.className='project-carousel'+(definition.pair?' carousel-tall':'');root.setAttribute('aria-roledescription','карусель');root.setAttribute('aria-label',definition.title+'. Фотографии');
    const frame=document.createElement('div');frame.className='carousel-frame';
    const controls=document.createElement('div');controls.className='carousel-controls';
    const prev=arrow('left','Предыдущие фотографии: '+definition.title),next=arrow('right','Следующие фотографии: '+definition.title);
    const count=document.createElement('span');count.className='carousel-count';count.setAttribute('aria-live','off');
    const pause=document.createElement('button');pause.type='button';pause.className='carousel-pause underlined';
    let current=0,paused=reduced.matches,hover=false,focused=false,visible=false,timer;
    const show=(index,manual=false)=>{
      current=(index+definition.slides.length)%definition.slides.length;
      const photos=definition.slides[current];frame.classList.toggle('carousel-pair',photos.length===2);
      const links=photos.map(([name,alt])=>{
        const a=document.createElement('a');a.className='project-media-link';a.href=definition.href;
        const img=document.createElement('img');img.src=`assets/works/${name}.jpg`;img.alt=alt;img.loading='lazy';img.width=1500;img.height=2000;
        a.append(img);return a;
      });
      frame.replaceChildren(...links);count.textContent=`${current+1} / ${definition.slides.length}`;
      count.setAttribute('aria-label',`Группа фотографий ${current+1} из ${definition.slides.length}`);
      if(manual){paused=true;update();}
      const preload=new Image();preload.src=`assets/works/${definition.slides[(current+1)%definition.slides.length][0][0]}.jpg`;
    };
    const update=()=>{
      clearInterval(timer);
      pause.textContent=paused?'Автопоказ':'Пауза';pause.setAttribute('aria-label',(paused?'Включить автопоказ: ':'Остановить автопоказ: ')+definition.title);
      pause.setAttribute('aria-pressed',String(!paused));
      if(!paused&&!hover&&!focused&&visible&&!document.hidden)timer=setInterval(()=>show(current+1),6500);
    };
    prev.addEventListener('click',()=>show(current-1,true));next.addEventListener('click',()=>show(current+1,true));
    pause.addEventListener('click',()=>{paused=!paused;update();});
    root.addEventListener('pointerenter',()=>{hover=true;update();});root.addEventListener('pointerleave',()=>{hover=false;update();});
    root.addEventListener('focusin',()=>{focused=true;update();});root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget)){focused=false;update();}});
    root.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1),true);}});
    document.addEventListener('visibilitychange',update);reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.2}).observe(root);
    controls.append(prev,count,next,pause);root.append(frame,controls);original.replaceWith(root);show(0);update();
  }
})();
