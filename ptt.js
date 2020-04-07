(() => {
  const toggle = tip => ({ key }) =>
    key === ' ' && document.querySelectorAll('[data-tooltip]').forEach(el => el.dataset.tooltip.includes(tip) && el.click());
  document.body.onkeyup = toggle('Turn off microphone');
  document.body.onkeydown = toggle('Turn on microphone');
})();
