// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  api: {
    tokens: {
      prods: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
      eyJpZCI6dHJ1ZSwiY2FwYWJpbGl0aWVzIjpbInJlYWRfcHJvZHMiXX0.
      B5KtPu3b8PyK52ve-bXQJ1FusY70h9EmpKciGiKyWzI`.replace(/\s/g, '')
    },
    url: 'https://api.dulcerias.navarromiranda.mx'
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
