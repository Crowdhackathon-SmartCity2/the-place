export class CapitalizeValueConverter {
  toView(value) {
    let finalStr = '';
    let splitStr = value.split(' ');

    for (let i = 0, len = splitStr.length; i < len; i++) {
      let currentSplit = splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
      finalStr += currentSplit + ' ';
    }

    return finalStr;
  }

  fromView(value) {

  }
}

