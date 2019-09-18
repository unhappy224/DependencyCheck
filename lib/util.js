"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function flatMap(array, callbackfn) {
    return Array.prototype.concat(...array.map(callbackfn));
}
exports.flatMap = flatMap;
function exit(msg, code = -1) {
    if (msg) {
        console.log(msg);
    }
    process.exit(code);
}
exports.exit = exit;
function err(msg) {
    if (msg) {
        console.log(chalk_1.default.red('Error: ') + msg);
    }
    process.exit(-1);
}
exports.err = err;
