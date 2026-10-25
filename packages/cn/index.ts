import classNames from "classnames";

export function cn(...args: classNames.ArgumentArray): string {
  return classNames(args);
}
