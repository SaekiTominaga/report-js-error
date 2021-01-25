interface jsErrorFetchOption {
    denyFilenames?: RegExp[];
    allowFilenames?: RegExp[];
    denyUAs?: RegExp[];
    allowUAs?: RegExp[];
    fetchHeaders?: HeadersInit;
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
     * エラー情報をエンドポイントに送信する
     *
     * @param {ErrorEvent} ev - ErrorEvent
     */
    private _errorEvent;
}
export {};
//# sourceMappingURL=ReportJSError.d.ts.map