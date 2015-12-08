/**
 * We are not having any test in linux,
 * so the auto-locate function is windows-only.
 */

import cp from 'child_process';

const extRegVal = function (stdout) {
  return stdout
    .replace(/^\s+|\s+$/, '')
    .replace(/\s+/g, '|')
    .split('|')[3]
    .replace(/\\/g, '/');
}

const extRoot = function (stdout) {
  return extRegVal(stdout)
    .replace(/"/g, '')
    .replace(/\/atom\.exe$/, '');
}

export function locateAtom (callback) {
  const locations = [
    'HKEY_CLASSES_ROOT\\*\\shell\\Atom',
    'HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\Atom',
    'HKEY_CLASSES_ROOT\\Directory\\shell\\Atom',
  ];

  let i = 0;
  (function searchAtom (i) {
    const location = locations[i];
    const query = `REG QUERY ${location} /v Icon`;
    cp.exec(query, function(err, stdout, stderr){
      if (!err && !stderr) callback(null, extRoot(stdout));
      else if (i < locations.length - 1) {
        i += 1;
        searchAtom(i);
      } else callback(1);
    });
  }(i));
}

export function locateAsar (callback) {
  locateAtom (function (err, result) {
    if (!err) {
      const asar = result + '/resources/app.asar';
      callback(null, asar);
    } else {
      callback(err);
    }
  })
}
