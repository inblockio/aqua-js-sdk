export var LogType;
(function (LogType) {
    LogType[LogType["SUCCESS"] = 0] = "SUCCESS";
    LogType[LogType["INFO"] = 1] = "INFO";
    LogType[LogType["ERROR"] = 2] = "ERROR";
    LogType[LogType["WARNING"] = 3] = "WARNING";
    LogType[LogType["HINT"] = 4] = "HINT";
    LogType[LogType["file"] = 5] = "file";
    LogType[LogType["link"] = 6] = "link";
    LogType[LogType["signature"] = 7] = "signature";
    LogType[LogType["witness"] = 8] = "witness";
    LogType[LogType["form"] = 9] = "form";
    LogType[LogType["scalar"] = 10] = "scalar";
})(LogType || (LogType = {}));
