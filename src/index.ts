#!/usr/bin/env node

// import Table from 'cli-table3'
import yargs from 'yargs';
import check from './check';
import { err } from './util';

const argv = yargs
  .usage(
    '检查依赖项 dpcheck <packages> <path> \n 使用逗号分隔需要检查的Package'
  )
  .help('help')
  .alias('help', 'h').argv;

let packages = typeof argv._[0] === 'string' ? argv._[0].split(',') : [];
if (packages.length === 0) {
  err('需要指定Packages');
} else {
  packages = ['__main', ...packages];
}

let cwd = process.cwd();

if (typeof argv._[1] === 'string') {
  cwd = argv._[1];
}

check(cwd, packages);
