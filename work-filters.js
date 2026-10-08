(() => {
  const form = document.querySelector('.work-filters');
  if (!form) return;
  const works = window.UZHVE_WORKS || [];
  const year = form.elements.year, medium = form.elements.medium;
  const count = form.querySelector('.filter-count');
  const empty = document.querySelector('.filter-empty');
  const cards = Array.from(document.querySelectorAll('.artwork-grid .work-item')).map(card => {
    const link = card.querySelector('a[href*="contact.html?work="]');
    const id = link ? new URL(link.href).searchParams.get('work') : null;
    return {card, work:works.find(work => work.id === id)};
  });
  const addOptions = (select, values) => values.forEach(value => {
    const option = document.createElement('option');option.value = value;option.textContent = value;select.append(option);
  });
  addOptions(year, [...new Set(works.map(work => work.year).filter(Boolean))].sort().reverse());
  addOptions(medium, [...new Set(works.flatMap(work => work.mediums))]);
  const params = new URLSearchParams(location.search);
  if (Array.from(year.options).some(option => option.value === params.get('year'))) year.value = params.get('year');
  if (Array.from(medium.options).some(option => option.value === params.get('medium'))) medium.value = params.get('medium');
  const apply = () => {
    let visible = 0;
    cards.forEach(({card,work}) => {
      const match = work && (!year.value || work.year === year.value) && (!medium.value || work.mediums.includes(medium.value));
      card.hidden = !match;if(match)visible++;
    });
    count.textContent = 'Показано: ' + visible + ' из ' + works.length;
    empty.hidden = visible > 0;
    form.querySelector('.filter-reset').disabled = !year.value && !medium.value;
    const url = new URL(location.href);
    for(const [key,value] of [['year',year.value],['medium',medium.value]]) value ? url.searchParams.set(key,value) : url.searchParams.delete(key);
    history.replaceState(null,'',url.pathname + url.search + url.hash);
  };
  form.addEventListener('change',apply);
  form.addEventListener('submit',event => event.preventDefault());
  form.addEventListener('reset',() => requestAnimationFrame(apply));
  apply();
})();
