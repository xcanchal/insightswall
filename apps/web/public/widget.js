(function () {
	var script = document.currentScript;
	if (!script) return;

	var projectId = script.getAttribute('data-project');
	if (!projectId) {
		console.warn('[InsightsWall] Missing data-project attribute on widget script.');
		return;
	}

	var label = script.getAttribute('data-label') || '\u{1F4A1} Feedback';
	var bgColor = script.getAttribute('data-color') || '#18181b';
	var baseUrl = new URL(script.src).origin;
	var targetUrl = baseUrl + '/project/' + projectId + '/suggestions';

	var btn = document.createElement('button');
	btn.textContent = label;
	btn.setAttribute('aria-label', 'Send feedback');

	btn.style.cssText = [
		'position:fixed',
		'bottom:20px',
		'right:20px',
		'z-index:9999',
		'padding:12px 20px',
		'border:none',
		'border-radius:999px',
		'background:' + bgColor,
		'color:#fff',
		'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',
		'font-size:14px',
		'font-weight:600',
		'cursor:pointer',
		'box-shadow:0 4px 12px rgba(0,0,0,0.15)',
		'transition:transform 0.15s ease,box-shadow 0.15s ease',
	].join(';');

	btn.addEventListener('mouseenter', function () {
		btn.style.transform = 'scale(1.05)';
		btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
	});

	btn.addEventListener('mouseleave', function () {
		btn.style.transform = 'scale(1)';
		btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
	});

	btn.addEventListener('click', function () {
		window.open(targetUrl, '_blank', 'noopener');
	});

	document.body.appendChild(btn);
})();
