/// <reference path="react-redux.d.ts" />

/** This contains all of the global ENV vars passed from server => client.
 * Previously was `process.env.XYZ`. */
declare var globalConfig: { [k: string]: string };

interface Rollbar {
  error?(msg: string): void;
}

declare var Rollbar: Rollbar | undefined;

declare namespace jest {
  export interface Matchers<R> {
    toBeSameTimeAs: jest.Expect;
  }
}
