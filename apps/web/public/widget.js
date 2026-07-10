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
			'line-height:1;',
			'text-decoration:none;',
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

		var link = document.createElement('a');
		link.id = BUTTON_ID;
		link.href = targetUrl;
		link.target = '_blank';
		link.rel = 'noopener';
		link.textContent = label;

		document.body.appendChild(link);
		return true;
	}

	if (!mount()) {
		document.addEventListener('DOMContentLoaded', mount, { once: true });
	}
})();
