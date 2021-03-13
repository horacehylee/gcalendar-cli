import Ora from "ora";
import { defaults } from "lodash";

export interface PromiseMiddleWareOptions {
  before: () => void;
  success: (res) => void;
  failed: (err) => void;
}

export const promiseMiddleware = (
  optionAction: () => PromiseMiddleWareOptions
) => {
  const { before, success, failed } = optionAction();
  return <T>(promiseIn: Promise<T>) => {
    before();
    return promiseIn
      .then((res) => {
        success(res);
        return Promise.resolve(res);
      })
      .catch((err) => {
        failed(err);
        return Promise.reject(err);
      });
  };
};

export interface PromiseLoadingOptions {
  message: string;
  spinner?: string;
  color?: string;
}

const DEFAULT_LOADING_OPTIONS: PromiseLoadingOptions = {
  message: "Loading",
  spinner: "shark",
  color: "white",
};

export const loading = (options?: PromiseLoadingOptions) =>
  promiseMiddleware(() => {
    let spinner: any;
    options = defaults(options, DEFAULT_LOADING_OPTIONS);
    return {
      before: () => {
        spinner = new Ora({
          text: options.message,
          spinner: <any>options.spinner,
          color: <any>options.color,
        }).start();
      },
      success: (res) => {
        spinner.succeed();
      },
      failed: (err) => {
        spinner.fail();
      },
    };
  });
