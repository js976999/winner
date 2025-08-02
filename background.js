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

  // Ensure the background updates on change
  bgSelect.addEventListener('change', setBackgroundImage);

  // On page load, update to the default selected value
  setBackgroundImage();
});
