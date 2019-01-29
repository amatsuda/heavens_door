(fn => {
  document.addEventListener('DOMContentLoaded', fn);
})(() => {
  document.getElementById('heavens-door-start').addEventListener('click', e => {
    document.getElementById('heavens-door-start').style.display = 'none';
    document.getElementById('heavens-door-stop').style.display = 'inline';
    document.getElementById('heavens-door-copy').style.display = 'inline';
  });

  document.getElementById('heavens-door-stop').addEventListener('click', e => {
    document.getElementById('heavens-door-start').style.display = 'inline';
    document.getElementById('heavens-door-stop').style.display = 'none';
    document.getElementById('heavens-door-copy').style.display = 'none';
  });
})
