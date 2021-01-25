interface jsErrorFetchOption {
	denyFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
	allowFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
}

/**
 * Send script error information to endpoints.
 */
export default class {
	#endpoint: string; // エンドポイントの URL
	#option: jsErrorFetchOption;

	#errorEventListener: (ev: ErrorEvent) => void;

	/**
	 * @param {string} endpoint - URL of the endpoint
	 * @param {jsErrorFetchOption} option - Information such as transmission conditions
	 */
	constructor(endpoint: string, option: jsErrorFetchOption = {}) {
		this.#endpoint = endpoint;
		this.#option = option;

		this.#errorEventListener = this._errorEvent.bind(this);
	}

	/**
	 * Initial processing
	 */
	init(): void {
		/* ユーザーエージェントがレポートを行う対象かどうかチェック */
		const ua = navigator.userAgent;

		const denyUAs = this.#option.denyUAs;
		if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent match the deny list.');
			return;
		}
		const allowUAs = this.#option.allowUAs;
		if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
			return;
		}

		window.addEventListener('error', this.#errorEventListener, { passive: true });
	}

	/**
	 * エラー情報をエンドポイントに送信する
	 *
	 * @param {ErrorEvent} ev - ErrorEvent
	 */
	private async _errorEvent(ev: ErrorEvent): Promise<void> {
		const message = ev.message;
		const filename = ev.filename;
		const lineno = ev.lineno;
		const colno = ev.colno;

		if (filename === '') {
			// 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0）
			console.error('ErrorEvent.filename is empty');
			return;
		}

		const denyFilenames = this.#option.denyFilenames;
		if (denyFilenames !== undefined && denyFilenames.some((denyFilename) => denyFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename match the deny list.');
			return;
		}
		const allowFilenames = this.#option.allowFilenames;
		if (allowFilenames !== undefined && !allowFilenames.some((allowFilename) => allowFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename does not match the allow list.');
			return;
		}

		switch (new URL(filename).protocol) {
			case 'https:':
			case 'http:':
				break;
			default:
				console.error('A JavaScript error has occurred in a non-HTTP protocol (This may be due to a browser extension).');
				return;
		}

		const formData = new FormData();
		formData.append('location', location.toString());
		formData.append('message', message);
		formData.append('filename', filename);
		formData.append('lineno', String(lineno));
		formData.append('colno', String(colno));

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: this.#option.fetchHeaders,
			body: new URLSearchParams(<string[][]>[...formData]),
		});
		if (!response.ok) {
			console.error(`"${response.url}" is ${response.status} ${response.statusText}`);
			return;
		}
	}
}
