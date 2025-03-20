const Reset = "\x1b[0m";
const Dim = "\x1b[2m";
const FgRed = "\x1b[31m";
const FgYellow = "\x1b[33m";
const FgGreen = "\x1b[32m"; // Added green color

export function cliRedify(content: string) {
  return FgRed + content + Reset;
}

export function cliYellowfy(content: string) {
  return FgYellow + content + Reset;
}

export function cliGreenify(content: string) {
  return FgGreen + content + Reset;
}

export function log_red(content: any) {
  console.log(cliRedify(content));
}

export function log_yellow(content: any) {
  console.log(cliYellowfy(content));
}

export function log_dim(content: string) {
  console.log(Dim + content + Reset);
}

export function log_success(content: any) {
  console.log(cliGreenify(content));
}
