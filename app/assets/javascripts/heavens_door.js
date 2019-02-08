(fn => {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    if ((typeof(Turbolinks) !== 'undefined') && (Turbolinks)) {
      document.addEventListener('turbolinks:load', fn);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
})(() => {
  const startBtn = document.getElementById('heavens-door-start');
  const stopBtn = document.getElementById('heavens-door-stop');
  const copyBtn = document.getElementById('heavens-door-copy');

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline';
    copyBtn.style.display = 'inline';

    if (!sessionStorage.heavensDoor) {
      sessionStorage.heavensDoor = `  scenario 'GENERATED' do
    visit '${window.location.pathname}'\n\n`;
    }
  });

  stopBtn.addEventListener('click', () => {
    startBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
    copyBtn.style.display = 'none';
    sessionStorage.removeItem('heavensDoor');
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(sessionStorage.heavensDoor)
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert(sessionStorage.heavensDoor);
      });
  });

  if (sessionStorage.heavensDoor) {
    startBtn.click();
  }

  function labelIdForElement(el) {
    if (el.id) {
      const label = document.querySelector(`label[for=${el.id}]`);
      return label ? label.innerHTML : el.id;
    }
  }

  Array.from(document.getElementsByTagName('form')).forEach(form => {
    form.addEventListener('submit', () => {
      if (sessionStorage.heavensDoor) {
        Array.from(form.querySelectorAll('input,textarea,select')).forEach(el => {
          const target = labelIdForElement(el) || el.id;

          if (['text', 'textarea', 'search', 'number', 'email', 'url', 'password', 'tel'].includes(el.type)) {
            if (el.value) {
              sessionStorage.heavensDoor += `    fill_in '${target}', with: '${el.value}'\n`;
            }
          } else if (el.type == 'date') {
            sessionStorage.heavensDoor += `    fill_in '${target}', with: Date.parse('${el.value}')\n`;
          } else if (el.type == 'select-one') {
            sessionStorage.heavensDoor += `    select '${el[el.selectedIndex].value}', from: '${target}'\n`;
          } else if (el.type == 'select-multiple') {
            Array.from(el.selectedOptions).forEach(o => {
              sessionStorage.heavensDoor += `    select '${o.value}', from: '${target}'\n`;
            })
          } else if ((el.type == 'radio') && el.checked) {
            sessionStorage.heavensDoor += `    choose '${el.value}'\n`;
          } else if ((el.type == 'checkbox') && el.checked) {
            sessionStorage.heavensDoor += `    check '${el.value}'\n`;
          }
        })

        sessionStorage.heavensDoor += `    click_button '${form.querySelector('input[type=submit]').value}'\n\n`;
      }
    });
  })

  Array.from(document.getElementsByTagName('a')).forEach(a => {
    a.addEventListener('click', () => {
      if (sessionStorage.heavensDoor) {
        sessionStorage.heavensDoor += `    click_link '${a.text}'\n\n`;
      }
    });
  })
})
