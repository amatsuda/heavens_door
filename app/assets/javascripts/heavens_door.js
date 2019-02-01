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
  document.getElementById('heavens-door-start').addEventListener('click', () => {
    document.getElementById('heavens-door-start').style.display = 'none';
    document.getElementById('heavens-door-stop').style.display = 'inline';
    document.getElementById('heavens-door-copy').style.display = 'inline';

    if (!sessionStorage.heavensDoor) {
      sessionStorage.heavensDoor = `  scenario 'GENERATED' do
    visit '${window.location.pathname}'\n\n`;
    }
  });

  document.getElementById('heavens-door-stop').addEventListener('click', () => {
    document.getElementById('heavens-door-start').style.display = 'inline';
    document.getElementById('heavens-door-stop').style.display = 'none';
    document.getElementById('heavens-door-copy').style.display = 'none';
    sessionStorage.clear('heavensDoor');
  });

  document.getElementById('heavens-door-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(sessionStorage.heavensDoor)
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert(sessionStorage.heavensDoor);
      });
  });

  if (sessionStorage.heavensDoor) {
    document.getElementById('heavens-door-start').click();
  }

  labelIdForElement = el => {
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
