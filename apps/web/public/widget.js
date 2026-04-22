(function () {
	var script = document.currentScript;
	if (!script) return;

	var BUTTON_ID = 'insightswall-widget-button';
	var STYLE_ID = 'insightswall-widget-style';
	var projectId = script.getAttribute('data-project');
	if (!projectId) {
		console.warn('[InsightsWall] Missing data-project attribute on widget script.');
		return;
	}

	var label = script.getAttribute('data-label') || '\u{1F4A1} Feedback';
	var bgColor = script.getAttribute('data-color') || '#18181b';
	var baseUrl = new URL(script.src).origin;
	var targetUrl = baseUrl + '/project/' + projectId + '/suggestions';

	function ensureStyles() {
		if (document.getElementById(STYLE_ID)) return;

		var style = document.createElement('style');
		style.id = STYLE_ID;
		style.textContent = [
			'#' + BUTTON_ID + '{',
			'position:fixed;',
			'bottom:20px;',
			'right:20px;',
			'z-index:9999;',
			'padding:12px 20px;',
			'border:none;',
			'border-radius:999px;',
			'background:' + bgColor + ';',
			'color:#fff;',
			'font-family:system-ui,sans-serif;',
			'font-size:14px;',
			'font-weight:600;',
			'cursor:pointer;',
			'box-shadow:0 4px 12px rgba(0,0,0,0.15);',
			'transition:transform 0.15s ease,box-shadow 0.15s ease;',
			'}',
			'#' + BUTTON_ID + ':hover{',
			'transform:scale(1.05);',
			'box-shadow:0 6px 16px rgba(0,0,0,0.2);',
			'}',
		].join('');

		(document.head || document.documentElement).appendChild(style);
	}

	function mount() {
		if (!document.body) return false;
		if (document.getElementById(BUTTON_ID)) return true;

		ensureStyles();

		var btn = document.createElement('button');
		btn.id = BUTTON_ID;
		btn.textContent = label;

		btn.addEventListener('click', function () {
			window.open(targetUrl, '_blank', 'noopener');
		});

		document.body.appendChild(btn);
		return true;
	}

	if (!mount()) {
		document.addEventListener('DOMContentLoaded', mount, { once: true });
	}
})();
