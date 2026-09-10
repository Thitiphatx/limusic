import { browser } from '$app/environment';

const NAME_KEY = 'limusic_app_name';
const LOGO_KEY = 'limusic_app_logo';
const SHOW_LOGO_KEY = 'limusic_show_logo';

export const branding = $state({
	name: (browser && localStorage.getItem(NAME_KEY)) || 'Limusic',
	logo: (browser && localStorage.getItem(LOGO_KEY)) || '',
	showLogo: browser ? localStorage.getItem(SHOW_LOGO_KEY) !== '0' : true
});

export function setAppName(name: string) {
	const trimmed = name.trim();
	branding.name = trimmed || 'Limusic';
	if (browser) {
		if (!trimmed || trimmed === 'Limusic') {
			localStorage.removeItem(NAME_KEY);
		} else {
			localStorage.setItem(NAME_KEY, trimmed);
		}
	}
}

export function setAppLogo(dataUrl: string | null) {
	branding.logo = dataUrl || '';
	if (browser) {
		if (!dataUrl) {
			localStorage.removeItem(LOGO_KEY);
		} else {
			localStorage.setItem(LOGO_KEY, dataUrl);
		}
	}
}

export function setShowLogo(show: boolean) {
	branding.showLogo = show;
	if (browser) {
		localStorage.setItem(SHOW_LOGO_KEY, show ? '1' : '0');
	}
}

export function resetBranding() {
	setAppName('Limusic');
	setAppLogo(null);
	setShowLogo(true);
}
