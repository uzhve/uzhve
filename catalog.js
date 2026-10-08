(() => {
  const grid=document.querySelector('.works-main .artwork-grid');
  if(!grid)return;
  const fragment=document.createDocumentFragment();
  for(const work of window.UZHVE_WORKS){
    const figure=document.createElement('figure');figure.className='work-item';
    const button=document.createElement('button');button.type='button';button.className='artwork-image';
    button.dataset.lightbox=`assets/works/${work.image}.jpg`;
    button.dataset.caption=[work.title,work.year,work.materials,work.size].filter(Boolean).join('. ');
    button.setAttribute('aria-label','Увеличить: '+work.title);
    const img=document.createElement('img');img.src=button.dataset.lightbox;img.alt=work.title;img.width=work.width;img.height=work.height;img.loading='lazy';button.append(img);
    const caption=document.createElement('figcaption');const title=document.createElement('h2');title.textContent=work.title;caption.append(title);
    const details=[work.materials,work.size].filter(Boolean).join(' / ');
    if(details){const p=document.createElement('p');p.className='work-medium';p.textContent=details;caption.append(p);}
    if(work.collaborator){const p=document.createElement('p');p.className='work-medium';p.textContent='Соавтор: '+work.collaborator;caption.append(p);}
    const utility=document.createElement('div');utility.className='work-utility';
    if(work.year){const time=document.createElement('time');time.textContent=work.year;utility.append(time);}
    const link=document.createElement('a');link.className='underlined';link.href=`contact.html?work=${work.id}#inquiry`;link.textContent='Запросить стоимость';utility.append(link);caption.append(utility);
    figure.append(button,caption);fragment.append(figure);
  }
  grid.replaceChildren(fragment);
})();
