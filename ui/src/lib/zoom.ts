import { getCurrentWebview } from '@tauri-apps/api/webview';

// Tauri's `zoomHotkeysEnabled` polyfill caps zoom-in at 1000%, which shreds the layout long before
// it gets there (fixed chrome overlaps, the player bar eats the page). Same hotkeys, our own
// ceiling. Default is 110% (1.1).
const MIN = 0.2;
const MAX = 1.8;
const STEP = 0.1;
export const DEFAULT_ZOOM = 1.1;

const ZOOM_KEY = 'zoom_level';

function getInitialZoom(): number {
	if (typeof localStorage === 'undefined') return DEFAULT_ZOOM;
	const saved = parseFloat(localStorage.getItem(ZOOM_KEY) ?? '');
	return !isNaN(saved) && saved >= MIN && saved <= MAX ? saved : DEFAULT_ZOOM;
}

let level = DEFAULT_ZOOM;

function apply(next: number) {
	next = Math.round(Math.min(Math.max(next, MIN), MAX) * 100) / 100;
	level = next;
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(ZOOM_KEY, String(level));
	}
	getCurrentWebview()
		.setZoom(level)
		.catch(() => {});
}

export function initZoom() {
	level = getInitialZoom();
	getCurrentWebview()
		.setZoom(level)
		.catch(() => {});

	const onKey = (e: KeyboardEvent) => {
		if (!e.ctrlKey && !e.metaKey) return;
		if (e.key === '-') apply(level - STEP);
		else if (e.key === '=' || e.key === '+') apply(level + STEP);
		else if (e.key === '0') apply(DEFAULT_ZOOM);
	};
	const onWheel = (e: WheelEvent) => {
		if (!e.ctrlKey) return;
		e.preventDefault();
		apply(level + (e.deltaY < 0 ? STEP : -STEP));
	};
	window.addEventListener('keydown', onKey);
	window.addEventListener('wheel', onWheel, { passive: false });
	return () => {
		window.removeEventListener('keydown', onKey);
		window.removeEventListener('wheel', onWheel);
	};
}

