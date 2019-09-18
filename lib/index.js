#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Table from 'cli-table3'
const yargs_1 = __importDefault(require("yargs"));
const check_1 = __importDefault(require("./check"));
const util_1 = require("./util");
const argv = yargs_1.default
    .usage('检查依赖项 dpcheck <packages> <path> \n 使用逗号分隔需要检查的Package')
    .help('help')
    .alias('help', 'h').argv;
let packages = typeof argv._[0] === 'string' ? argv._[0].split(',') : [];
if (packages.length === 0) {
    util_1.err('需要指定Packages');
}
else {
    packages = ['__main', ...packages];
}
let cwd = process.cwd();
if (typeof argv._[1] === 'string') {
    cwd = argv._[1];
}
check_1.default(cwd, packages);
