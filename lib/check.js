"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const version_util_1 = require("npm-check-updates/lib/version-util");
function check(cwd, packages) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(fs.pathExistsSync(path.join(cwd, 'node_modules')))) {
            util_1.err(`找不到 ${chalk_1.default.yellow('node_modules')} ,请在项目目录下运行并安装好依赖`);
        }
        const allDeps = new Set(util_1.flatMap(packages, (pkg) => {
            const pkgPath = pkg === '__main' ? '../' : pkg;
            const packageFilePath = path.join(cwd, './node_modules', pkgPath, 'package.json');
            if (!(fs.pathExistsSync(packageFilePath))) {
                util_1.err(`找不到 ${chalk_1.default.yellow(packageFilePath)} ,请在项目目录下运行并安装好依赖`);
            }
            const json = fs.readJSONSync(packageFilePath);
            return Object.keys(json['dependencies']);
        }));
        const packageDepVersions = packages.map((pkg) => {
            const pkgPath = pkg === '__main' ? '../' : pkg;
            return {
                pkg,
                deps: fs.readJSONSync(path.join(cwd, './node_modules', pkgPath, 'package.json'))['dependencies']
            };
        });
        packages[0] = path.basename(path.dirname(cwd));
        const table = new cli_table3_1.default({
            head: ['Package', ...packages],
            colAligns: [
                'center',
                ...packages.map((_) => 'center')
            ]
        });
        allDeps.forEach((d) => {
            let vs = [];
            let ps = [];
            packageDepVersions.forEach((p) => {
                ps.push(p.pkg);
                vs.push(p.deps[d] || '');
            });
            if (vs.filter((v) => v).length <= 1) {
                return;
            }
            let base = vs[0];
            let out = [d, base];
            let hasDiff = false;
            for (let i = 1; i < vs.length; i++) {
                if (vs[i]) {
                    if (!base) {
                        base = vs[i];
                    }
                    if (vs[i] !== base) {
                        hasDiff = true;
                        out.push(version_util_1.colorizeDiff(base, vs[i]));
                    }
                    else {
                        out.push(vs[i] || '-');
                    }
                }
                else {
                    out.push('-');
                }
            }
            if (hasDiff) {
                table.push(out);
            }
        });
        console.log(table.toString());
    });
}
exports.default = check;
