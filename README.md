# Send script error information to endpoints

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Freport-js-error.svg)](https://badge.fury.io/js/%40saekitominaga%2Freport-js-error)

Detects the `error` event of the `window` object and sends error information to the endpoint.

## Demo

- [Demo page](https://saekitominaga.github.io/report-js-error/demo.html)

## Examples

```JavaScript
import ReportJSError from '@saekitominaga/report-js-error';

const reportJSError = new ReportJSError('https://report.example.com/js', {
  'allowFilenames': [
    /\.js$/,
    /\.mjs$/,
  ],
  'denyUAs': [
    /Googlebot\/2.1;/,
  ],
  'fetchHeaders': {
    'X-Requested-With': 'hoge',
  },
});
reportJSError.init();
```

## Constructor

```TypeScript
new ReportJSError(endpoint: string, option: {
	denyFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
	allowFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
} = {})
```

### Parameters

<dl>
<dt>endpoint [required]</dt>
<dd>URL of the endpoint</dd>
<dt>option [optional]</dt>
<dd>Information such as transmission conditions</dd>
</dl>

- If neither `denyFilenames` nor `allowFilenames` is specified, any user agent will be accepted.
- If neither `denyUAs` nor `allowUAs` is specified, any file name will be accepted.
