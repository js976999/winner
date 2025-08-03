document.addEventListener('DOMContentLoaded', function() {
  const bgSelect = document.getElementById('bg-select');
  const bgLayer = document.getElementById('background-layer');

  function setBackgroundImage() {
    const img = bgSelect.value;
    if (!img) {
      bgLayer.style.backgroundImage = 'none';
      bgLayer.style.opacity = '0.4'; // default opacity
    } else {
      bgLayer.style.backgroundImage = `url('${img}')`;
      bgLayer.style.opacity = '0.4'; // default opacity
    }
  }

  bgSelect.addEventListener('change', setBackgroundImage);

  // On load, update to default
  setBackgroundImage();
});
