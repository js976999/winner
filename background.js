document.addEventListener('DOMContentLoaded', function() {
  const bgSelect = document.getElementById('bg-select');
  const bgLayer = document.getElementById('background-layer');

  if (!bgSelect || !bgLayer) return;

  function setBackgroundImage() {
    const img = bgSelect.value;
    bgLayer.style.opacity = '0.4'; // Always set default opacity
    if (!img) {
      bgLayer.style.backgroundImage = 'none';
    } else {
      // Preload image to only set if it exists
      const testImg = new window.Image();
      testImg.onload = function() {
        bgLayer.style.backgroundImage = `url('${img}')`;
      };
      testImg.onerror = function() {
        bgLayer.style.backgroundImage = 'none';
      };
      testImg.src = img;
    }
  }

  bgSelect.addEventListener('change', setBackgroundImage);

  // On load, update to default
  setBackgroundImage();
});
