(() => {
  const toggle = tip => ({ key }) =>
    key === ' ' && !document.querySelector('textarea') && document.querySelectorAll('[data-tooltip]').forEach(el => el.dataset.tooltip.includes(tip) && el.click());
    document.body.addEventListener('keyup', toggle('Turn off microphone'));
    document.body.addEventListener('keydown', toggle('Turn on microphone'));
})();
