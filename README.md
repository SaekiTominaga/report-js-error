# Send script error information to endpoints

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Freport-js-error.svg)](https://badge.fury.io/js/%40saekitominaga%2Freport-js-error)

Detects the `error` event of the `window` object and sends error information to the endpoint.

## Demo

- [Demo page](https://saekitominaga.github.io/report-js-error/demo.html)

## Examples

```JavaScript
import ReportJsError from '@saekitominaga/report-js-error';

const reportJsError = new ReportJsError('https://report.example.com/js', {
  fetchParam: {
    location: 'loc',
    message: 'msg',
    filename: 'file',
    lineno: 'line',
    colno: 'col',
  },
  fetchContentType: 'application/json',
  fetchHeaders: {
    'X-Requested-With': 'hoge',
  },
  allowFilenames: [
    /\.js$/,
    /\.mjs$/,
  ],
  denyUAs: [
    /Googlebot\/2.1;/,
  ],
});
reportJsError.init();
```

## Constructor

```TypeScript
new ReportJsError(endpoint: string, option: {
  fetchParam?: {
    location: string; // Field name when sending `location` to an endpoint. The default value when omitted is `location`. (e.g. location=https%3A%2F%2Fexample.com%2Fpath%2Fto&message=(omit)&filename=(omit)&lineno=(omit)&colno=(omit) )
    message: string; // Field name when sending `ErrorEvent.message` to an endpoint. The default value when omitted is `message`. (e.g. location=(omit)&message=ReferenceError%3A+hoge+is+not+defined&filename=(omit)&lineno=(omit)&colno=(omit) )
    filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint. The default value when omitted is `filename`. (e.g. location=(omit)&referrer=(omit)&message=(omit)&filename=https%3A%2F%2Fexample.com%2Fpath%2Fto&lineno=(omit)&colno=(omit) )
    lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint. The default value when omitted is `lineno`. (e.g. location=(omit)&referrer=(omit)&message=(omit)&filename=(omit)&lineno=10&colno=(omit) )
    colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint. The default value when omitted is `colno`. (e.g. location=(omit)&referrer=(omit)&message=(omit)&filename=(omit)&lineno=(omit)&colno=20 )
  },
  fetchContentType?: fetchContentType; // `Content-Type` header to be set in `fetch()` request. ('application/x-www-form-urlencoded' or 'application/json')
  fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
  denyFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
  allowFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
  denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report
  allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report
} = {})
```

### Parameters

<dl>
<dt><code>endpoint</code> [required]</dt>
<dd>URL of the endpoint</dd>
<dt><code>option</code> [optional]</dt>
<dd>Information such as transmission conditions</dd>
</dl>

- If neither `denyFilenames` nor `allowFilenames` is specified, any user agent will be accepted.
- If neither `denyUAs` nor `allowUAs` is specified, any file name will be accepted.
