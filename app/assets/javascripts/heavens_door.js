(fn => {
  document.addEventListener('DOMContentLoaded', fn);
})(() => {
  document.getElementById('heavens-door-start').addEventListener('click', e => {
    document.getElementById('heavens-door-start').style.display = 'none';
    document.getElementById('heavens-door-stop').style.display = 'inline';
    document.getElementById('heavens-door-copy').style.display = 'inline';

    if (!sessionStorage.heavensDoor) {
      sessionStorage.heavensDoor = `  scenario 'GENERATED' do
    visit '${window.location.pathname}'\n\n`;
    }
  });

  document.getElementById('heavens-door-stop').addEventListener('click', e => {
    document.getElementById('heavens-door-start').style.display = 'inline';
    document.getElementById('heavens-door-stop').style.display = 'none';
    document.getElementById('heavens-door-copy').style.display = 'none';
    sessionStorage.clear('heavensDoor');
  });

  document.getElementById('heavens-door-copy').addEventListener('click', e => {
    navigator.clipboard.writeText(sessionStorage.heavensDoor)
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert(sessionStorage.heavensDoor);
      });
  });

  if (sessionStorage.heavensDoor) {
    document.getElementById('heavens-door-start').click();
  }
})
