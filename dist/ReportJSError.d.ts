interface FetchParam {
    location: string;
    message: string;
    filename: string;
    lineno: string;
    colno: string;
}
declare type fetchContentType = 'application/x-www-form-urlencoded' | 'application/json';
interface Option {
    fetchParam?: FetchParam;
    fetchContentType?: fetchContentType;
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
     * @param {Option} option - Information such as transmission conditions
     */
    constructor(endpoint: string, option?: Option);
    /**
     * Initial processing
     */
    init(): void;
    /**
     * ユーザーエージェントがレポートを行う対象かどうかチェックする
     *
     * @returns {boolean} 対象なら true
     */
    private checkUserAgent;
    /**
     * エラー情報をエンドポイントに送信する
     *
     * @param {ErrorEvent} ev - ErrorEvent
     */
    private errorEvent;
}
export {};
//# sourceMappingURL=ReportJSError.d.ts.map