import * as fs from 'fs-extra';
import * as path from 'path';
import { err, flatMap } from './util';
import chalk from 'chalk';
import Table from 'cli-table3';
import { colorizeDiff } from 'npm-check-updates/lib/version-util';

export default async function check(cwd: string, packages: string[]) {
  if (!(fs.pathExistsSync(path.join(cwd, 'node_modules')))) {
    err(
      `找不到 ${chalk.yellow('node_modules')} ,请在项目目录下运行并安装好依赖`
    );
  }

  const allDeps = new Set(
    flatMap(packages, (pkg) => {
      const pkgPath = pkg === '__main' ? '../' : pkg;
      const packageFilePath = path.join(cwd, './node_modules', pkgPath, 'package.json');
      if (!(fs.pathExistsSync(packageFilePath))) {
        err(
          `找不到 ${chalk.yellow(packageFilePath)} ,请在项目目录下运行并安装好依赖`
        );
      }
      const json = fs.readJSONSync(
        packageFilePath
      );
      return Object.keys(json['dependencies']);
    })
  );

  const packageDepVersions = packages.map((pkg) => {
    const pkgPath = pkg === '__main' ? '../' : pkg;
    return {
      pkg,
      deps: fs.readJSONSync(
        path.join(cwd, './node_modules', pkgPath, 'package.json')
      )['dependencies']
    };
  });

  packages[0] = path.basename(path.dirname(cwd));
  const table = new Table({
    head: ['Package', ...packages],
    colAligns: [
      'center',
      ...packages.map((_) => 'center' as Table.HorizontalAlignment)
    ]
  }) as Table.HorizontalTable;

  allDeps.forEach((d) => {
    let vs: string[] = [];
    let ps: string[] = [];

    packageDepVersions.forEach((p) => {
      ps.push(p.pkg);
      vs.push(p.deps[d] || '');
    });

    if (vs.filter((v) => v).length <= 1) {
      return;
    }

    let base = vs[0];
    let out: string[] = [d, base];
    let hasDiff = false;
    for (let i = 1; i < vs.length; i++) {
      if (vs[i]) {
        if (!base) {
          base = vs[i];
        }
        if (vs[i] !== base) {
          hasDiff = true;
          out.push(colorizeDiff(base, vs[i]));
        } else {
          out.push(vs[i] || '-');
        }
      } else {
        out.push('-');
      }
    }

    if (hasDiff) {
      table.push(out);
    }
  });

  console.log(table.toString());
}
