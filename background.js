document.addEventListener('DOMContentLoaded', function() {
  const bgSelect = document.getElementById('bg-select');
  const bgLayer = document.getElementById('background-layer');
  const opacitySlider = document.getElementById('bg-opacity');
  const opacityValue = document.getElementById('bg-opacity-value');

  function setBackgroundImage() {
    const img = bgSelect.value;
    if (!img) {
      bgLayer.style.backgroundImage = 'none';
    } else {
      bgLayer.style.backgroundImage = `url('${img}')`;
    }
  }

  function setOpacity() {
    const val = opacitySlider.value;
    bgLayer.style.opacity = (val / 100).toString();
    opacityValue.textContent = val + '%';
  }

  bgSelect.addEventListener('change', setBackgroundImage);
  opacitySlider.addEventListener('input', setOpacity);

  // On load, update to defaults
  setBackgroundImage();
  setOpacity();
});
