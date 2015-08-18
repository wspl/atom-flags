import readLn from 'readline-sync';
import colors from 'colors';
import asar from 'asar';

import {locateAsar} from './locate';
import {Flags} from './flags';

let flags;

function cmd (stdin, callback) {
  const args = stdin.split(/\s+/);
  switch (args[0]) {
    case '': callback(); break;
    case 'help':
      console.log('GOTO: https://github.com/wspl/atom-flags')
      callback();
      break;
    case 'locate':
      try {
        flags = new Flags(args[1]);
        console.log('ASAR Opened: ' + args[1]);
        console.log('MD5: ' + flags.md5);
      } catch (e) {
        console.log('Cannot open an invalid .asar file.')
      }
      callback();
      break;
    case 'get':
      if (flags.isOpen) {
        console.log(`["${args[1]}"] => ${flags.get(args[1])}`);
      } else {
        console.log('You need open an .asar file first.')
      }
      callback();
      break;
    case 'set':
      if (flags.isOpen) {
        flags.set(args[1], args[2]);
        console.log(`["${args[1]}"] => ${flags.get(args[1])}`);
      } else {
        console.log('You need open an .asar file first.')
      }
      callback();
      break;
    case 'list':
      if (flags.isOpen) {
        flags.list(function (key, val) {
          console.log(`["${key}"] => ${val}`);
        });
      } else {
        console.log('You need open an .asar file first.');
      }
      callback();
      break;
    case 'save':
      if (flags.isOpen) {
        flags.save(function () {
          console.log('Saved!');
          callback();
        });
      } else {
        console.log('You need open an .asar file first.');
      }
      break;
    default:
      console.log('Invalid Command! Press "help" for more information.');
      callback();
      break;
  }
}

locateAsar(function(err, rs) {
  if (!err) {
    flags = new Flags(rs);
    console.log('ASAR Opened: ' + rs);
    console.log('MD5: ' + flags.md5);
  } else {
    console.log('Cannot find Atom Editor! Please use "locate <path-to-asar-file>".');
  }

  (function unlimited () {
    if (flags.isOpen) {
      cmd(readLn.question('atom-flags> '), unlimited);
    } else {
      cmd(readLn.question('atom-flags?> '), unlimited);
    }
  }())
});
