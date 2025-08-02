document.addEventListener('DOMContentLoaded', function() {
  const bgSelect = document.getElementById('bg-select');
  const bgLayer = document.getElementById('background-layer');

  function setBackgroundImage() {
    const img = bgSelect.value;
    if (!img) {
      bgLayer.style.backgroundImage = 'none';
    } else {
      bgLayer.style.backgroundImage = `url('${img}')`;
    }
  }

  bgSelect.addEventListener('change', setBackgroundImage);

  // Optional: remember last choice for session
  if (window.sessionStorage) {
    bgSelect.value = sessionStorage.getItem('chosenBG') || '';
    setBackgroundImage();
    bgSelect.addEventListener('change', function() {
      sessionStorage.setItem('chosenBG', bgSelect.value);
    });
  } else {
    setBackgroundImage();
  }
});
