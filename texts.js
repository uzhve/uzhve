(() => {
  const texts=window.UZHVE_TEXTS;
  const date=value=>value?new Intl.DateTimeFormat('ru',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value)):'';
  const row=(text,level=2)=>{
    const article=document.createElement('article');article.className='text-row';
    const heading=document.createElement('div'),h=document.createElement('h'+level),a=document.createElement('a');a.href='text.html?id='+text.id;a.textContent=text.title;h.append(a);heading.append(h);
    const type=document.createElement('p');type.className='text-type';type.textContent=[text.kind,date(text.date)].filter(Boolean).join(' / ');heading.append(type);
    const excerpt=document.createElement('p');excerpt.className='text-excerpt';excerpt.textContent=text.excerpt;article.append(heading,excerpt);return article;
  };
  const preview=document.querySelector('#texts-preview');
  if(preview){
    const section=document.createElement('section');section.className='section home-texts';section.id='texts';
    section.innerHTML='<div class="section-heading"><h2>Тексты</h2><a href="texts.html">Все тексты</a></div><div class="texts-preview-list"></div>';
    for(const text of [texts.find(t=>t.id==='legacy'),texts.find(t=>t.id==='coordinates'),texts.find(t=>t.id==='ladder')])section.lastElementChild.append(row(text,3));
    preview.replaceWith(section);
  }
  const list=document.querySelector('#texts-list');
  if(list)for(const text of [...texts].sort((a,b)=>(b.date||'').localeCompare(a.date||'')))list.append(row(text));
  const article=document.querySelector('#text-article');
  if(!article)return;
  const text=texts.find(t=>t.id===new URLSearchParams(location.search).get('id'));
  if(!text){article.innerHTML='<h1>Текст не найден</h1><p><a class="underlined" href="texts.html">Вернуться к текстам</a></p>';document.title='Текст не найден | Константин Ужве';return;}
  document.title=text.title+' | Константин Ужве';document.querySelector('meta[name="description"]').content=text.excerpt;
  const h=document.createElement('h1');h.textContent=text.title;
  const deck=document.createElement('p');deck.className='text-deck';deck.textContent=[text.kind,date(text.date)].filter(Boolean).join(' / ');
  const body=document.createElement('div');body.className='text-body';
  for(const copy of text.paragraphs){const p=document.createElement('p');p.textContent=copy;body.append(p);}
  article.append(h,deck,body);
  if(text.image){const img=document.createElement('img');img.className='text-article-image';img.src='assets/works/'+text.image+'.jpg';img.alt=text.title;img.width=1080;img.height=1350;img.loading='lazy';article.append(img);}
  const related=document.createElement('div');related.className='text-related';
  if(text.source.startsWith('uzhve_art/')){const source=document.createElement('p');source.textContent='Первоначальная публикация: @uzhve_art'+(text.date?' · '+date(text.date):'');related.append(source);}
  if(text.project){const a=document.createElement('a');a.className='underlined';a.href='project.html?id='+text.project;a.textContent='Посмотреть проект';related.append(a);}
  article.append(related);
})();
