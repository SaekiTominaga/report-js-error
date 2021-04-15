interface FetchParam {
	location: string; // Field name when sending `location` to an endpoint.
	message: string; // Field name when sending `ErrorEvent.message` to an endpoint.
	filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint.
	lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint.
	colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint.
}
type fetchContentType = 'application/x-www-form-urlencoded' | 'application/json';

interface Option {
	fetchParam?: FetchParam;
	fetchContentType?: fetchContentType;
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	denyFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
	allowFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report
}

/**
 * Send script error information to endpoints.
 */
export default class {
	#endpoint: string; // URL of the endpoint
	#option: Option; // Information such as transmission conditions

	#errorEventListener: (ev: ErrorEvent) => void;

	/**
	 * @param {string} endpoint - URL of the endpoint
	 * @param {Option} option - Information such as transmission conditions
	 */
	constructor(endpoint: string, option: Option = {}) {
		this.#endpoint = endpoint;

		if (option.fetchParam === undefined) {
			option.fetchParam = {
				location: 'location',
				message: 'message',
				filename: 'filename',
				lineno: 'lineno',
				colno: 'colno',
			};
		}
		this.#option = option;

		this.#errorEventListener = this.errorEvent.bind(this);
	}

	/**
	 * Initial processing
	 */
	init(): void {
		if (!this.checkUserAgent()) {
			return;
		}

		window.addEventListener('error', this.#errorEventListener, { passive: true });
	}

	/**
	 * ユーザーエージェントがレポートを行う対象かどうかチェックする
	 *
	 * @returns {boolean} 対象なら true
	 */
	private checkUserAgent(): boolean {
		const ua = navigator.userAgent;

		const denyUAs = this.#option.denyUAs;
		if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent match the deny list.');
			return false;
		}
		const allowUAs = this.#option.allowUAs;
		if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
			return false;
		}

		return true;
	}

	/**
	 * エラー情報をエンドポイントに送信する
	 *
	 * @param {ErrorEvent} ev - ErrorEvent
	 */
	private async errorEvent(ev: ErrorEvent): Promise<void> {
		const message = ev.message;
		const filename = ev.filename;
		const lineno = ev.lineno;
		const colno = ev.colno;

		if (filename === '') {
			// 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0）
			console.error('`ErrorEvent.filename` is empty.');
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

		const fetchParam = <FetchParam>this.#option.fetchParam;

		const formData = new FormData();
		formData.append(fetchParam.location, location.toString());
		formData.append(fetchParam.message, message);
		formData.append(fetchParam.filename, filename);
		formData.append(fetchParam.lineno, String(lineno));
		formData.append(fetchParam.colno, String(colno));

		const contentType = this.#option.fetchContentType;

		const fetchHeaders = new Headers(this.#option.fetchHeaders);
		if (contentType !== undefined) {
			fetchHeaders.set('Content-Type', contentType);
		}

		const fetchBody: BodyInit =
			contentType === 'application/json' ? JSON.stringify(Object.fromEntries(formData)) : new URLSearchParams(<string[][]>[...formData]);

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: fetchHeaders,
			body: fetchBody,
		});

		if (!response.ok) {
			console.error(`"${response.url}" is ${response.status} ${response.statusText}`);
			return;
		}
	}
}
