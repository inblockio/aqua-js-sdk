const Reset = "\x1b[0m";
const Dim = "\x1b[2m";
const FgRed = "\x1b[31m";
const FgYellow = "\x1b[33m";
const FgGreen = "\x1b[32m"; // Added green color

/**
 * Formats text in red color for CLI output
 * @param content - Text to be colored red
 * @returns String with ANSI color codes for red text
 */
export function cliRedify(content: string) {
  return FgRed + content + Reset;
}

/**
 * Formats text in yellow color for CLI output
 * @param content - Text to be colored yellow
 * @returns String with ANSI color codes for yellow text
 */
export function cliYellowfy(content: string) {
  return FgYellow + content + Reset;
}

/**
 * Formats text in green color for CLI output
 * @param content - Text to be colored green
 * @returns String with ANSI color codes for green text
 */
export function cliGreenify(content: string) {
  return FgGreen + content + Reset;
}

/**
 * Logs text to console in red color
 * @param content - Content to be logged in red
 */
export function log_red(content: any) {
  console.log(cliRedify(content));
}

/**
 * Logs text to console in yellow color
 * @param content - Content to be logged in yellow
 */
export function log_yellow(content: any) {
  console.log(cliYellowfy(content));
}

/**
 * Logs text to console with dimmed brightness
 * @param content - Content to be logged with dim effect
 */
export function log_dim(content: string) {
  console.log(Dim + content + Reset);
}

/**
 * Logs success messages to console in green color
 * @param content - Success message to be logged in green
 */
export function log_success(content: any) {
  console.log(cliGreenify(content));
}
