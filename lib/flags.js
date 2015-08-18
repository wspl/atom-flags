import fs from 'fs';
import asar from 'asar';
import md5 from 'md5';

export class Flags {

  constructor (filePath) {
    this.tempDir = process.env.TEMP.replace(/\\/g, '/') + '/atom-flags';

    this.origin = filePath;

    this.md5 = md5(filePath);
    this.target = this.tempDir + '/' + this.md5;
    if (!fs.existsSync(this.target)) asar.extractAll(filePath, this.target);

    this.windowJSPath = this.target + '/src/browser/atom-window.js';
    this.windowJS = fs.readFileSync(this.windowJSPath).toString();

    this.placeholder = '$#*{atom-flags}*#$';

    const wp = this.windowJS.match(/'web-preferences':[\d\D]*?}/)[0];
    this.lns = wp.split(/\r\n|\n|\r/);

    this.sample = this.lns[1]
      .replace(/\'.+\'/, '\'(key)\'')
      .replace(/:.+$/, ':(val),');

    this.windowJS = this.windowJS.replace(wp, this.placeholder);

    this.isOpen = true;
  }

  set (key, val) {
    const line = this.sample
      .replace('(key)', key)
      .replace('(val)', ' ' + val);

    let isNew = true;

    for (const i in this.lns) {
      const ln = this.lns[i];
      if (ln.indexOf(`'${key}'`) > -1) {
        this.lns[i] = line;
        isNew = false;
      }
    }

    if (isNew) {
      const lnsLen = this.lns.length;
      this.lns[lnsLen] = this.lns[lnsLen - 1];
      this.lns[lnsLen - 1] = line;
    }

    for (const i in this.lns) {
      const ln = this.lns[i];
      if ( 0 < i && i < this.lns.length - 1) {
        const lnln = ln.replace(/\s*$/, '');
        const finChar = lnln.charAt(lnln.length - 1);
        if (finChar !== ',') {
          this.lns[i] = ln + ',';
        }
      }
    }

    const wp = this.lns.join('\n');
    this.windowJS = this.windowJS.replace(this.placeholder, wp);
    fs.writeFileSync(this.windowJSPath, this.windowJS);
  }

  get (key) {
    for (const i in this.lns) {
      const ln = this.lns[i];
      if (ln.indexOf(`'${key}'`) > -1) {
        return ln
          .replace(/^.+:\s*/, '')
          .replace(/,$/, '');
      }
    }
  }

  list (callback) {
    for (const i in this.lns) {
      const ln = this.lns[i];
      if ( 0 < i && i < this.lns.length - 1) {
        const key = ln
          .replace(/^\s*'/, '')
          .replace(/'.*$/, '');
        const val = ln
          .replace(/^.+:\s*/, '')
          .replace(/,$/, '');
        callback(key, val);
      }
    }
  }

  del (key) {
    for (const i in this.lns) {
      const ln = this.lns[i];
      if (ln.indexOf(`'${key}'`) > -1) {
        this.lns.splice(i, 1);
      }
    }
  }

  save (callback) {
    fs.renameSync(this.origin, this.origin + '.bak.' + (+ new Date()));
    asar.createPackage(this.target, this.origin, callback);
  }
}
