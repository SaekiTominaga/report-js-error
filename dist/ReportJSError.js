var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _endpoint, _option, _errorEventListener;
/**
 * Send script error information to endpoints.
 */
export default class {
    /**
     * @param {string} endpoint - URL of the endpoint
     * @param {jsErrorFetchOption} option - Information such as transmission conditions
     */
    constructor(endpoint, option = {}) {
        _endpoint.set(this, void 0); // エンドポイントの URL
        _option.set(this, void 0);
        _errorEventListener.set(this, void 0);
        __classPrivateFieldSet(this, _endpoint, endpoint);
        __classPrivateFieldSet(this, _option, option);
        __classPrivateFieldSet(this, _errorEventListener, this._errorEvent.bind(this));
    }
    /**
     * Initial processing
     */
    init() {
        /* ユーザーエージェントがレポートを行う対象かどうかチェック */
        const ua = navigator.userAgent;
        const denyUAs = __classPrivateFieldGet(this, _option).denyUAs;
        if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
            console.info('No JavaScript error report will be sent because the user agent match the deny list.');
            return;
        }
        const allowUAs = __classPrivateFieldGet(this, _option).allowUAs;
        if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
            console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
            return;
        }
        window.addEventListener('error', __classPrivateFieldGet(this, _errorEventListener), { passive: true });
    }
    /**
     * エラー情報をエンドポイントに送信する
     *
     * @param {ErrorEvent} ev - ErrorEvent
     */
    async _errorEvent(ev) {
        const message = ev.message;
        const filename = ev.filename;
        const lineno = ev.lineno;
        const colno = ev.colno;
        if (filename === '') {
            // 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0）
            console.error('ErrorEvent.filename is empty');
            return;
        }
        const denyFilenames = __classPrivateFieldGet(this, _option).denyFilenames;
        if (denyFilenames !== undefined && denyFilenames.some((denyFilename) => denyFilename.test(filename))) {
            console.info('No JavaScript error report will be sent because the filename match the deny list.');
            return;
        }
        const allowFilenames = __classPrivateFieldGet(this, _option).allowFilenames;
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
        const response = await fetch(__classPrivateFieldGet(this, _endpoint), {
            method: 'POST',
            headers: __classPrivateFieldGet(this, _option).fetchHeaders,
            body: new URLSearchParams([...formData]),
        });
        if (!response.ok) {
            console.error(`"${response.url}" is ${response.status} ${response.statusText}`);
            return;
        }
    }
}
_endpoint = new WeakMap(), _option = new WeakMap(), _errorEventListener = new WeakMap();
//# sourceMappingURL=ReportJSError.js.map