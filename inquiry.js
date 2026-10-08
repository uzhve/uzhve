(() => {
  const template = "<section class=\"inquiry-section\" id=\"inquiry\" aria-labelledby=\"inquiry-title\"><h2 id=\"inquiry-title\">Запросить стоимость</h2><p>Цена и доступность работы уточняются лично. Заполните контакты, чтобы подготовить письмо художнику.</p>\n<form id=\"inquiry-form\">\n<div class=\"form-field\"><label for=\"inquiry-work\">Работа</label><select id=\"inquiry-work\" name=\"work\" required><option value=\"\">Выберите работу</option></select></div>\n<div class=\"form-field\"><label for=\"inquiry-name\">Ваше имя</label><input id=\"inquiry-name\" name=\"name\" autocomplete=\"name\" required maxlength=\"120\"></div>\n<div class=\"form-field\"><label for=\"inquiry-email\">Email для ответа</label><input id=\"inquiry-email\" name=\"email\" type=\"email\" autocomplete=\"email\" required maxlength=\"200\"></div>\n<div class=\"form-field\"><label for=\"inquiry-phone\">Телефон <span>(необязательно)</span></label><input id=\"inquiry-phone\" name=\"phone\" type=\"tel\" autocomplete=\"tel\" maxlength=\"80\"></div>\n<div class=\"form-field\"><label for=\"inquiry-message\">Сообщение <span>(необязательно)</span></label><textarea id=\"inquiry-message\" name=\"message\" rows=\"4\" maxlength=\"2000\"></textarea></div>\n<button class=\"text-action\" type=\"submit\">Подготовить письмо</button><p class=\"form-note\">Форма не отправляет и не сохраняет данные. Готовое письмо можно открыть в вашей почтовой программе или скопировать.</p>\n</form>\n<div class=\"inquiry-draft\" id=\"inquiry-draft\" hidden><h3>Письмо подготовлено</h3><label for=\"draft-text\">Текст письма</label><textarea id=\"draft-text\" readonly rows=\"10\"></textarea><div class=\"draft-actions\"><a class=\"text-action\" id=\"draft-email\">Открыть в почте</a><button class=\"underlined\" id=\"draft-copy\" type=\"button\">Скопировать письмо</button></div><p class=\"form-note\" id=\"draft-status\" role=\"status\">Чтобы отправить запрос, откройте письмо в почте и нажмите «Отправить».</p></div>\n\n</section>";
  const works = window.UZHVE_WORKS || [];
  const modal = document.createElement('dialog');
  modal.className = 'inquiry-modal';
  modal.setAttribute('aria-labelledby', 'modal-inquiry-title');
  modal.innerHTML = '<div class="inquiry-modal-header"><button type="button" class="inquiry-close" aria-label="Закрыть запрос стоимости">Закрыть <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button></div><div class="inquiry-modal-body">' + template.replaceAll('id="', 'id="modal-').replaceAll('for="', 'for="modal-').replaceAll('aria-labelledby="', 'aria-labelledby="modal-') + '</div>';
  document.body.append(modal);
  let trigger;

  const picker = document.createElement('dialog');
  picker.id = 'work-picker';
  picker.className = 'work-picker';
  picker.setAttribute('aria-labelledby', 'work-picker-title');
  picker.innerHTML = '<div class="work-picker-header"><div class="work-picker-heading"><h2 id="work-picker-title">Выбрать работу</h2><button type="button" class="inquiry-close" aria-label="Закрыть выбор работы">Закрыть <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button></div><label for="work-picker-search">Поиск по названию или году</label><input id="work-picker-search" type="search" autocomplete="off" placeholder="Например, Комета"><p class="work-picker-status" role="status" aria-live="polite"></p></div><div class="work-picker-grid"></div><p class="work-picker-empty" hidden>Ничего не найдено. Попробуйте другое название или год.</p>';
  document.body.append(picker);
  picker.querySelector('#work-picker-title').textContent = 'Выбрать работы';
  const pickerFooter = document.createElement('div'); pickerFooter.className = 'work-picker-footer';
  pickerFooter.innerHTML = '<p role="status" aria-live="polite">Выбрано: <span>0</span></p><button type="button" class="text-action">Готово</button>';
  picker.append(pickerFooter);
  const search = picker.querySelector('input');
  const pickerGrid = picker.querySelector('.work-picker-grid');
  let pickerForm;
  let pickerTrigger;
  let pendingWorks = new Set();
  const updateCount = () => {pickerFooter.querySelector('span').textContent = pendingWorks.size;};
  pickerFooter.querySelector('button').addEventListener('click', () => {pickerForm.setWorks([...pendingWorks]); picker.close();});
  const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  const renderPicker = () => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    const filtered = works.filter(work => terms.every(term => normalize([work.title, work.year].join(' ')).includes(term)));
    const fragment = document.createDocumentFragment();
    for (const work of filtered) {
      const button = document.createElement('label');
      button.className = 'work-picker-item';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = pendingWorks.has(work.id);
      checkbox.setAttribute('aria-label', [work.title,work.year].filter(Boolean).join(', '));
      button.classList.toggle('is-selected', checkbox.checked);
      const image = document.createElement('img');
      image.src = `assets/works/${work.image}.jpg`; image.alt = ''; image.width = work.width; image.height = work.height; image.loading = 'lazy';
      const name = document.createElement('span'); name.className = 'work-picker-name'; name.textContent = work.title;
      const year = document.createElement('span'); year.className = 'work-picker-year'; year.textContent = work.year || '';
      const caption = document.createElement('span'); caption.className = 'work-picker-check'; caption.append(checkbox, name);
      button.append(image, caption, year);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) pendingWorks.add(work.id); else pendingWorks.delete(work.id);
        button.classList.toggle('is-selected', checkbox.checked); updateCount();
      });
      fragment.append(button);
    }
    pickerGrid.replaceChildren(fragment);
    picker.querySelector('.work-picker-empty').hidden = filtered.length > 0;
    picker.querySelector('.work-picker-status').textContent = `Показано: ${filtered.length} из ${works.length}`;
    updateCount();
  };
  search.addEventListener('input', renderPicker);
  picker.querySelector('.inquiry-close').addEventListener('click', () => picker.close());
  picker.addEventListener('click', event => {
    if (event.target !== picker) return;
    const box = picker.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) picker.close();
  });
  picker.addEventListener('close', () => {
    document.body.classList.remove('work-picker-open');
    pickerTrigger?.focus({preventScroll:true});
  });

  const setupForm = (container, prefix) => {
    const form = container.querySelector('#' + prefix + 'inquiry-form');
    if (!form) return;
    const select = form.elements.work;
    select.multiple = true;
    for (const work of works) {
      const option = document.createElement('option');
      option.value = work.id; option.textContent = [work.title,work.year].filter(Boolean).join(', ');
      select.append(option);
    }
    // Keep the native field as a fallback and the single source for FormData.
    const workField = select.closest('.form-field');
    const choose = document.createElement('button');
    choose.type = 'button'; choose.className = 'work-choice'; choose.id = prefix + 'work-choice';
    choose.setAttribute('aria-haspopup', 'dialog'); choose.setAttribute('aria-controls', picker.id);
    const error = document.createElement('p'); error.className = 'work-choice-error'; error.id = prefix + 'work-error'; error.hidden = true; error.textContent = 'Выберите хотя бы одну работу, чтобы запросить стоимость.';
    choose.setAttribute('aria-describedby', error.id);
    select.hidden = true; select.required = false;
    workField.querySelector('label').htmlFor = choose.id;
    workField.querySelector('label').textContent = 'Работы';
    workField.append(choose, error);
    const renderChoice = () => {
      const selectedIds = new Set([...select.selectedOptions].map(option => option.value));
      const selectedWorks = works.filter(item => selectedIds.has(item.id));
      choose.replaceChildren();
      choose.classList.toggle('has-works', selectedWorks.length > 0);
      if (selectedWorks.length) {
        for (const work of selectedWorks) {
        const entry = document.createElement('span'); entry.className = 'work-choice-entry';
        const image = document.createElement('img'); image.src = `assets/works/${work.image}.jpg`; image.alt = ''; image.width = work.width; image.height = work.height;
        const copy = document.createElement('span'); copy.className = 'work-choice-copy';
        const name = document.createElement('span'); name.textContent = work.title;
        const year = document.createElement('span'); year.className = 'work-choice-year'; year.textContent = work.year || '';
        copy.append(name, year); entry.append(image, copy); choose.append(entry);
        }
        const action = document.createElement('span'); action.className = 'underlined work-choice-action'; action.textContent = 'Изменить выбор'; choose.append(action);
        const selectedNames=selectedWorks.map(work=>[work.title,work.year].filter(Boolean).join(', ')).join('; ');
        choose.setAttribute('aria-label', `Изменить выбор работ. Выбрано: ${selectedWorks.length}. ${selectedNames}`);
      } else {
        choose.textContent = 'Выбрать работы'; choose.setAttribute('aria-label', 'Выбрать работы');
      }
      error.hidden = true; choose.removeAttribute('aria-invalid');
    };
    form.setWorks = ids => {
      const selectedIds = new Set(ids);
      for (const option of select.options) option.selected = selectedIds.has(option.value) && option.value !== '';
      renderChoice(); form.dispatchEvent(new Event('input', {bubbles:true}));
    };
    form.setWork = id => form.setWorks([id]);
    select.addEventListener('change', renderChoice);
    renderChoice();
    choose.addEventListener('click', () => {
      pickerForm = form; pickerTrigger = choose; pendingWorks = new Set([...select.selectedOptions].map(option => option.value).filter(Boolean)); search.value = ''; renderPicker();
      picker.showModal(); picker.scrollTop = 0; document.body.classList.add('work-picker-open');
      search.focus({preventScroll:true});
    });
    const topic = form.elements.topic;
    const message = form.elements.message;
    const title = container.querySelector('#' + prefix + 'inquiry-title');
    const description = title.nextElementSibling;
    const topicNames = {message:'Написать мне',price:'Запросить стоимость работы',collaboration:'Сотрудничество',exhibition:'Выставка или публикация'};
    const updateTopic = () => {
      if (!topic) return;
      const price = topic.value === 'price';
      select.closest('.form-field').hidden = !price;
      select.required = false; select.disabled = !price;
      message.required = !price;
      message.previousElementSibling.querySelector('span').textContent = price ? '(необязательно)' : '';
      title.textContent = topic.value === 'message' ? 'Написать мне' : topicNames[topic.value];
      description.textContent = price ? 'Выберите одну или несколько работ и оставьте контакты, чтобы уточнить стоимость и доступность.' : 'Расскажите о вашем вопросе или предложении. Оставьте email для ответа.';
      message.placeholder = topic.value === 'collaboration' ? 'Расскажите о проекте, формате сотрудничества и сроках.' : topic.value === 'exhibition' ? 'Название площадки или издания, идея и предполагаемые даты.' : '';
      container.querySelector('#' + prefix + 'inquiry-draft').hidden = true;
    };
    topic?.addEventListener('change', updateTopic);
    form.updateTopic = updateTopic;
    updateTopic();
    const draft = container.querySelector('#' + prefix + 'inquiry-draft');
    const draftText = container.querySelector('#' + prefix + 'draft-text');
    const status = container.querySelector('#' + prefix + 'draft-status');
    form.addEventListener('input', () => {draft.hidden = true;});
    form.addEventListener('submit', event => {
      event.preventDefault();
      if ((!topic || topic.value === 'price') && !select.value) {
        error.hidden = false; choose.setAttribute('aria-invalid', 'true'); choose.focus(); return;
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const selectedIds = new Set(data.getAll('work'));
      const selectedWorks = works.filter(item => selectedIds.has(item.id));
      const selectedTopic = topic?.value || 'price';
      if (selectedTopic === 'price' && !selectedWorks.length) return;
      const subject = selectedTopic === 'price' ? (selectedWorks.length === 1 ? 'Запрос стоимости: ' + [selectedWorks[0].title, selectedWorks[0].year].filter(Boolean).join(', ') : 'Запрос стоимости нескольких работ (' + selectedWorks.length + ')') : topicNames[selectedTopic];
      const text = [
        'Здравствуйте, Константин!', '',
        selectedTopic === 'price' ? 'Хочу узнать стоимость и доступность ' + (selectedWorks.length === 1 ? 'работы:' : 'следующих работ:') : 'Тема: ' + topicNames[selectedTopic],
        selectedTopic === 'price' ? selectedWorks.map((work,index) => (index + 1) + '. «' + work.title + '»' + (work.year ? ', ' + work.year : '') + '\n' + [work.materials,work.size].filter(Boolean).join('. ')).join('\n\n') : '', '',
        'Имя: ' + data.get('name').trim(),
        'Email: ' + data.get('email').trim(),
        data.get('phone').trim() ? 'Телефон: ' + data.get('phone').trim() : '', '',
        data.get('message').trim()
      ].join('\n');
      draftText.value = text;
      container.querySelector('#' + prefix + 'draft-email').href = 'mailto:uzhveko@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      status.textContent = 'Чтобы отправить запрос, откройте письмо в почте и нажмите «Отправить».';
      draft.hidden = false;
      draft.scrollIntoView({block:'nearest', behavior:'instant'});
    });
    container.querySelector('#' + prefix + 'draft-copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(draftText.value);
        status.textContent = 'Текст скопирован. Отправьте его на uzhveko@gmail.com.';
      } catch {
        draftText.focus(); draftText.select();
        status.textContent = 'Выделили текст письма. Скопируйте его и отправьте на uzhveko@gmail.com.';
      }
    });
  };
  setupForm(modal, 'modal-');
  const contactForm = document.querySelector('main #inquiry-form');
  if (contactForm) {
    setupForm(contactForm.closest('.inquiry-section'), '');
    const selected = new URLSearchParams(location.search).get('work');
    if (works.some(work => work.id === selected)) {
      contactForm.setWork(selected);
      contactForm.elements.topic.value = 'price';
      contactForm.updateTopic();
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="contact.html?work="]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const id = new URL(link.href).searchParams.get('work');
    if (!works.some(work => work.id === id) || typeof modal.showModal !== 'function') return;
    event.preventDefault();
    trigger = link;
    const form = modal.querySelector('form');
    form.setWork(id);
    modal.querySelector('.inquiry-draft').hidden = true;
    modal.showModal();
    document.body.classList.add('inquiry-open');
    document.querySelector('.site-header')?.classList.remove('is-scrolling');
    modal.scrollTop = 0;
    modal.querySelector('[name="name"]').focus({preventScroll:true});
  });
  modal.querySelector('.inquiry-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('inquiry-open');
    trigger?.focus({preventScroll:true});
  });
})();
