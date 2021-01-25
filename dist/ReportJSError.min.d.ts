interface jsErrorFetchParam {
    location: string;
    message: string;
    filename: string;
    lineno: string;
    colno: string;
}
interface jsErrorFetchOption {
    fetchParam?: jsErrorFetchParam;
    fetchHeaders?: HeadersInit;
    denyFilenames?: RegExp[];
    allowFilenames?: RegExp[];
    denyUAs?: RegExp[];
    allowUAs?: RegExp[];
}
/**
 * Send script error information to endpoints.
 */
export default class {
    #private;
    /**
     * @param {string} endpoint - URL of the endpoint
     * @param {jsErrorFetchOption} option - Information such as transmission conditions
     */
    constructor(endpoint: string, option?: jsErrorFetchOption);
    /**
     * Initial processing
     */
    init(): void;
    /**
     * ユーザーエージェントがレポートを行う対象かどうかチェックする
     *
     * @returns {boolean} 対象なら true
     */
    private _checkUserAgent;
    /**
     * エラー情報をエンドポイントに送信する
     *
     * @param {ErrorEvent} ev - ErrorEvent
     */
    private _errorEvent;
}
export {};
//# sourceMappingURL=ReportJSError.d.ts.map