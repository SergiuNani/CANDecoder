function p(x) {
  return console.log(x);
}
function pp(x) {
  return console.log(x);
}
//Query DOM
function dom(x) {
  return document.querySelector(`${x}`);
}
/*******************************************************************************/
/*------------------------Array functions------------------------ */
/*******************************************************************************/
/*------------------------------*/
/*Function: reverseArray(arr)*/
/*IN: "abc"|| [1,2,3,4,5]*/
/*OUT: "cba" || [5,4,3,2,1] */
function reverseArray(arr) {
  if (typeof arr == "string") {
    arr = arr.split("");
    arr = reverseArray(arr);
    arr = arr.join("");
    return arr;
  }
  var arr2 = [];
  var temp;
  for (var i = 0; i < arr.length / 2; i++) {
    temp = arr[i];
    arr2[i] = arr[arr.length - 1 - i];
    arr2[arr.length - 1 - i] = temp;
  }
  return arr2;
}
/*------------------------------*/
/*Function: removeSpaces(arr)*/
/*IN: [' ', ' ', '3  3', 'dede bhdeyhdf']*/
/*OUT: ['', '', '33', 'dedebhdeyhdf'] */
function removeSpaces(arr) {
  if (typeof arr == "object") {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].replace(/\s/g, "");
    }
    return arr;
  } else {
    arr = arr.replace(/\s/g, "");
    return arr;
  }
}

/*------------------------------*/
/*Function: returnMaxFromArr(arr), arr --- string or arr*/
/*IN: "12354"*/
/*OUT: "5" */
/*OBS: no negative nr or letters - this undermines the funtion */
function returnMaxFromArr(arr) {
  arr_copy = arr;
  if (typeof arr[0] == "string") {
    arr[0] = parseInt(arr[0]);
  }
  var aux = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] == "string") {
      arr[i] = parseInt(arr[i]);
    }
    if (aux < arr[i]) {
      aux = arr[i];
    }
  }

  return [aux, arr_copy.indexOf(aux)];
  //Returns [MAX_nr, index_in_array]
}
/*L2B_endian(arr) - Little to Big Endian transformation */
/*IN: L2B_endian("AB CD E")*/
/*OUT:  0ECDAB*/
function L2B_endian(arr) {
  var aux1;
  var aux2;
  arr = arr.toUpperCase();
  if (arr == "") {
    return "";
  }
  if (typeof arr == "object") {
    arr = arr.map((x) => {
      return L2B_endian(x);
    });
    return arr;
  }
  if (typeof arr == "number") {
    arr = arr.toString();
    return L2B_endian(arr);
  }
  if (typeof arr == "string") {
    arr = check_validity_hex(arr, 32);
    //case of "AB CD E"
    if (arr.length % 2 != 0) {
      arr = arr.split("");
      arr[arr.length - 1] = `0${arr[arr.length - 1]}`;
      arr = arr.join("");
    }
    aux2 = arr.match(/.{1,2}/g);

    for (var i = 0; i < aux2.length / 2; i++) {
      aux1 = aux2[i];
      aux2[i] = aux2[aux2.length - 1 - i];
      aux2[aux2.length - 1 - i] = aux1;
    }
    return aux2.join("");
  }
}

/*SDO_format(arr) */
/*IN:"2341600312AB34CD"*/
/*OUT: 23  4160  03  12AB34CD*/
function SDO_format(arr) {
  arr = check_validity_hex(arr, 64);
  arr = arr.split("");
  var aux = ["", "", "", ""];
  aux[0] = arr.splice(0, 2);
  aux[0] = aux[0].join("");
  aux[1] = arr.splice(0, 4);
  aux[1] = aux[1].join("");
  aux[2] = arr.splice(0, 2);
  aux[2] = aux[2].join("");
  aux[3] = arr.join("");

  if (aux[0].length < 3 && aux[0].length != 0) {
    arr = `${aux[0]}`;
  }
  if (aux[1].length < 5 && aux[1].length != 0) {
    arr = `${aux[0]}  ${aux[1]}`;
  }
  if (aux[2].length < 3 && aux[2].length != 0) {
    arr = `${aux[0]}  ${aux[1]}  ${aux[2]}`;
  }

  if (aux[3].length < 9 && aux[3].length != 0) {
    arr = `${aux[0]}  ${aux[1]}  ${aux[2]}  ${aux[3]}`;
  }
  return arr;
}
/*devideStrBy2(str) */
/*IN:"abcdeg"*/
/*OUT: ab cd eg*/
function devideStrBy2(str) {
  str = removeSpaces(str);
  if (str == "") {
    return "";
  }
  str = str.match(/.{1,2}/g);
  var aux = "";
  str.forEach((el) => {
    aux = aux.concat(el + " ");
  });
  return aux;
}

/*******************************************************************************/
/*---------------------Number transformation functions------------------------ */
/*******************************************************************************/

function hexToDec(arr, resolution) {
  if (typeof arr == "number") {
    arr = arr.toString();
    return hexToDec(arr, resolution);
  }
  if (typeof arr == "string") {
    arr = check_validity_hex(arr, resolution);
    var aux;

    if (arr == "") {
      return 0;
    }
    aux = parseInt(arr, 16);
    if (resolution == 32) {
      if (aux - Math.pow(2, 31) < 0) {
        return aux;
      } else {
        return aux - Math.pow(2, 32);
      }
    }
    if (resolution == 16) {
      if (aux - Math.pow(2, 15) < 0) {
        return aux;
      } else {
        return aux - Math.pow(2, 16);
      }
    }
  }
  if (typeof arr == "object") {
    arr = arr.map((x) => {
      return hexToDec(x, resolution);
    });
    return arr;
  }
}
//small problem: in: number the 16 bit rez dont work cause checkValidity inp is string
function decToHex(arr, resolution) {
  if (typeof arr == "number") {
    if (resolution == 32) {
      if (arr < 0) {
        arr = 4294967296 + arr;

        return arr.toString(16).toUpperCase();
      } else {
        return (arr = arr.toString(16).toUpperCase());
      }
    }
    if (resolution == 16) {
      if (arr < 0) {
        arr = 65536 + arr;

        return arr.toString(16).toUpperCase();
      } else {
        return (arr = arr.toString(16).toUpperCase());
      }
    }
  }
  if (typeof arr == "string") {
    if (arr == "-" || arr == "") {
      return 0;
    }
    arr = check_validity_decimal(arr, resolution);
    return decToHex(parseInt(arr, 10), resolution);
  }
  if (typeof arr == "object") {
    arr = arr.map((x) => {
      return decToHex(x, resolution);
    });
  }

  return arr;
}
function hex2bin(hex, resolution) {
  if (resolution == 16) {
    return parseInt(hex, 16).toString(2).padStart(16, "0");
  } else if (resolution == 8) {
    return parseInt(hex, 16).toString(2).padStart(8, "0");
  } else return parseInt(hex, 16).toString(2).padStart(32, "0");
}
function bin2hex(bin) {
  return parseInt(bin, 2).toString(16).toUpperCase();
}
function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

//checks if the arr has any elements which are not hexa and returns the arr without the bad elements
//can be limited to 16 or 32 bits
function check_validity_hex(arr, type) {
  if (typeof arr == "object") {
    arr.forEach((el) => {
      check_validity_hex(el, type);
    });
  }
  if (typeof arr == "string") {
    arr = arr.split("");
    for (var i = 0; i < arr.length; i++) {
      if (isNaN(parseInt(arr[i], 16))) {
        arr[i] = "";
      }
    }
    arr = arr.join("");
    if (type == 8) {
      if (arr.length > 2) {
        arr = arr.split("");
        arr.splice(2);
        arr = arr.join("");
        return arr;
      } else return arr;
    }
    if (type == 16) {
      if (arr.length > 4) {
        arr = arr.split("");
        arr.splice(4);
        arr = arr.join("");
        return arr;
      } else return arr;
    }
    if (type == 32) {
      if (arr.length > 8) {
        arr = arr.split("");
        arr.splice(8);
        arr = arr.join("");
        return arr;
      } else return arr;
    }
    if (type == 64) {
      if (arr.length > 16) {
        arr = arr.split("");
        arr.splice(16);
        arr = arr.join("");
        return arr;
      } else return arr;
    }
    if (type == 0) {
      return arr;
    }
  }
}

//checks if the arr has any elements which are not dec and returns the arr without
// the bad elements, unsigned 16 or 32 and we not cycling (going to + - then +) , definite limits
//We not accounting for 4.5
function check_validity_decimal(arr, resolution) {
  if (arr == "") {
    return "";
  }
  arr = arr.split("");
  var aux = "";
  if (arr[0] == "-") {
    aux = "-";
  }
  for (var i = 0; i < arr.length; i++) {
    if (isNaN(parseInt(arr[i], 10))) {
      arr[i] = "";
    }
  }
  arr = arr.join("");
  arr = aux.concat(arr);
  if (arr.length == 1 && arr[0] == "-") {
    return arr;
  }
  if (arr == "") {
    return arr;
  }
  if (resolution == 16) {
    arr = parseInt(arr, 10);
    var a = 32767;
    if (arr > a) {
      a = a.toString();
      return a;
    }
    if (arr < -a - 1) {
      arr = -a - 1;
      arr = arr.toString();
      return arr;
    }
    arr = arr.toString();
    return arr;
  }
  if (resolution == 32) {
    arr = parseInt(arr, 10);
    var a = 2147483647;
    if (arr > a) {
      a = a.toString();
      return a;
    }
    if (arr < -a - 1) {
      arr = -a - 1;
      arr = arr.toString();
      return arr;
    }
    arr = arr.toString();
    return arr;
  }
  //No filtration infinite access
  if (resolution == 0) {
    arr = parseInt(arr, 10).toString();
    return arr;
  }
}

function checkVal_dec_comma(str, resolution) {
  var aux = str.indexOf(".");
  var aux2 = str.split(".");
  var aux3 = aux2[0];
  var aux4 = "";
  if (aux2.length > 1) {
    for (var i = 1; i < aux2.length; i++) {
      aux4 = aux4.concat(aux2[i]);
    }
  }
  if (aux4 != "") {
    aux4 = aux4.split("");
    for (var k = 0; k < aux4.length; k++) {
      if (isNaN(parseInt(aux4[k], 10))) {
        aux4[k] = "";
      }
    }
    aux4 = aux4.join("");
    if (parseInt(aux4) > 99899) {
      aux4 = "99899";
    }
  }

  if (resolution == "16") {
    aux3 = check_validity_decimal(aux3, 16);
  } else if (resolution == "32") {
    aux3 = check_validity_decimal(aux3, 32);
  } else if (resolution == "0") {
    var temp = "";
    if (aux3 == "--") {
      aux3 = "=";
    }
    if (aux3[0] == "-" && aux3 != "-" && aux3[1] == "0") {
      temp = "-";
    }
    aux3 = check_validity_decimal(aux3, 0);
    aux3 = temp.concat(aux3);
  }

  if (aux != -1) {
    aux3 = aux3 + "." + aux4;

    return aux3;
  } else {
    return aux3;
  }
}

/*******************************************************************************/
/*--------------------------------Object functions ----------------------------*/
/*******************************************************************************/

/*------------------------------------*/
//
//   Function    :function UnitsConvertor(inputValue,inputUnits,returnUnits,fullRot_IU,object_type)
//
//   Description : It will internally convert one unit to another and return only the value in the specified units
/*   IN   : UnitsConvertor("258", "in/s^2", "IU", OneRot_IU_value.value, "6085");*/
/*   OUT  : "1.31064"  */
/*------------------------------------*/
function UnitsConvertor(
  inputValue,
  inputUnits,
  returnUnits,
  fullRot_IU,
  object_type
) {
  fullRot_IU = parseInt(fullRot_IU);
  inputValue = parseFloat(inputValue);

  object_type = FG_object(object_type);
  var aux_IU; //temp var for all types of IU

  //For pos

  //Velocity

  if (object_type == "pos") {
    //ROT
    var one_rad = fullRot_IU / (2 * Math.PI);
    var one_deg = one_rad * 0.0174533;
    var one_rot = one_rad * 2 * Math.PI;
    var aux_rad;
    var aux_deg;
    var aux_rot;
    //LIN
    var one_m = fullRot_IU;
    var one_mm = one_m * 0.001;
    var one_um = one_m * 1e-6;
    var one_in = one_m * 0.0254;
    var one_ft = one_m * 0.3048;
    var aux_m;
    var aux_mm;
    var aux_um;
    var aux_in;
    var aux_ft;

    if (inputUnits == "rad") {
      aux_IU = one_rad * inputValue;
    } else if (inputUnits == "deg") {
      aux_IU = one_deg * inputValue;
    } else if (inputUnits == "rot") {
      aux_IU = one_rot * inputValue;
    } else if (inputUnits == "IU") {
      aux_IU = inputValue;
    } else if (inputUnits == "m") {
      aux_IU = one_m * inputValue;
    } else if (inputUnits == "mm") {
      aux_IU = one_mm * inputValue;
    } else if (inputUnits == "um") {
      aux_IU = one_um * inputValue;
    } else if (inputUnits == "in") {
      aux_IU = one_in * inputValue;
    } else if (inputUnits == "ft") {
      aux_IU = one_ft * inputValue;
    }
    //rot
    aux_rad = Number((aux_IU / one_rad).toFixed(3));
    aux_deg = Math.ceil(Number((aux_IU / one_deg).toFixed(3)));
    aux_rot = Number((aux_IU / one_rot).toFixed(3));

    //lin
    aux_m = Number((aux_IU / one_m).toFixed(3));
    aux_mm = Number((aux_IU / one_mm).toFixed(3));
    aux_um = Number((aux_IU / one_um).toFixed(3));
    aux_in = Number((aux_IU / one_in).toFixed(3));
    aux_ft = Number((aux_IU / one_ft).toFixed(3));
    aux_IU = Math.floor(aux_IU);

    if (returnUnits == "IU") {
      return aux_IU.toString();
    } else if (returnUnits == "rad") {
      return aux_rad.toString();
    } else if (returnUnits == "rot") {
      return aux_rot.toString();
    } else if (returnUnits == "deg") {
      return aux_deg.toString();
    } else if (returnUnits == "m") {
      return aux_m.toString();
    } else if (returnUnits == "mm") {
      return aux_mm.toString();
    } else if (returnUnits == "um") {
      return aux_um.toString();
    } else if (returnUnits == "in") {
      return aux_in.toString();
    } else if (returnUnits == "ft") {
      return aux_ft.toString();
    }
    return;
  }
  //VELOCITY
  if (object_type == "spd") {
    //rot
    var one_rad_s = (fullRot_IU * slow_loop) / (2 * Math.PI);
    var one_rpm = one_rad_s * 0.10472;
    var one_rps = one_rad_s * 6.2831853071796;
    var one_deg_s = one_rad_s * 0.0174533;
    var one_deg_min = one_rad_s * 0.000290888;
    var aux_rpm;
    var aux_rad_s;
    var aux_rps;
    var aux_deg_s;
    var aux_deg_min;
    //LIN
    var one_m_s = fullRot_IU * slow_loop;
    var one_mm_s = one_m_s * 0.001;
    var one_um_s = one_m_s * 1e-6;
    var one_in_s = one_m_s * 0.0254;
    var one_ft_s = one_m_s * 0.3048;
    var one_mm_min = one_m_s * 1.66667e-5;
    var one_in_min = one_m_s / 2362.2;
    var one_ft_min = one_m_s * 0.00508;
    var aux_m_s;
    var aux_mm_s;
    var aux_um_s;
    var aux_in_s;
    var aux_ft_s;
    var aux_mm_min;
    var aux_in_min;
    var aux_ft_min;

    if (inputUnits == "rpm") {
      aux_IU = one_rpm * inputValue;
    } else if (inputUnits == "rad/s") {
      aux_IU = one_rad_s * inputValue;
    } else if (inputUnits == "rps") {
      aux_IU = one_rps * inputValue;
    } else if (inputUnits == "deg/s") {
      aux_IU = one_deg_s * inputValue;
    } else if (inputUnits == "deg/min") {
      aux_IU = one_deg_min * inputValue;
    } else if (inputUnits == "IU") {
      aux_IU = inputValue;
    } else if (inputUnits == "m/s") {
      aux_IU = one_m_s * inputValue;
    } else if (inputUnits == "mm/s") {
      aux_IU = one_mm_s * inputValue;
    } else if (inputUnits == "um/s") {
      aux_IU = one_um_s * inputValue;
    } else if (inputUnits == "in/s") {
      aux_IU = one_in_s * inputValue;
    } else if (inputUnits == "ft/s") {
      aux_IU = one_ft_s * inputValue;
    } else if (inputUnits == "mm/min") {
      aux_IU = one_mm_min * inputValue;
    } else if (inputUnits == "in/min") {
      aux_IU = one_in_min * inputValue;
    } else if (inputUnits == "ft/min") {
      aux_IU = one_ft_min * inputValue;
    }
    aux_rpm = Number((aux_IU / one_rpm).toFixed(3));
    aux_rad_s = Number((aux_IU / one_rad_s).toFixed(3));
    aux_rps = Number((aux_IU / one_rps).toFixed(3));
    aux_deg_s = Number((aux_IU / one_deg_s).toFixed(3));
    aux_deg_min = Number((aux_IU / one_deg_min).toFixed(3));
    //lin
    aux_m_s = Number((aux_IU / one_m_s).toFixed(3));
    aux_mm_s = Number((aux_IU / one_mm_s).toFixed(3));
    aux_um_s = Number((aux_IU / one_um_s).toFixed(3));
    aux_in_s = Number((aux_IU / one_in_s).toFixed(3));
    aux_ft_s = Number((aux_IU / one_ft_s).toFixed(3));
    aux_mm_min = Number((aux_IU / one_mm_min).toFixed(3));
    aux_in_min = Number((aux_IU / one_in_min).toFixed(3));
    aux_ft_min = Number((aux_IU / one_ft_min).toFixed(3));
    aux_IU = Number(aux_IU.toFixed(4));

    if (returnUnits == "IU") {
      return aux_IU.toString();
    } else if (returnUnits == "deg/min") {
      return aux_deg_min.toString();
    } else if (returnUnits == "deg/s") {
      return aux_deg_s.toString();
    } else if (returnUnits == "rps") {
      return aux_rps.toString();
    } else if (returnUnits == "rad/s") {
      return aux_rad_s.toString();
    } else if (returnUnits == "rpm") {
      return aux_rpm.toString();
    } else if (returnUnits == "m/s") {
      return aux_m_s.toString();
    } else if (returnUnits == "mm/s") {
      return aux_mm_s.toString();
    } else if (returnUnits == "um/s") {
      return aux_um_s.toString();
    } else if (returnUnits == "in/s") {
      return aux_in_s.toString();
    } else if (returnUnits == "ft/s") {
      return aux_ft_s.toString();
    } else if (returnUnits == "mm/min") {
      return aux_mm_min.toString();
    } else if (returnUnits == "in/min") {
      return aux_in_min.toString();
    } else if (returnUnits == "ft/min") {
      return aux_ft_min.toString();
    }
    return;
  }
  //ACCELERATION CONDITIONS
  if (object_type == "acc") {
    var one_rad_s2 = (fullRot_IU * Math.pow(slow_loop, 2)) / (2 * Math.PI);
    var one_deg_s2 = one_rad_s2 / 57.2958;
    var one_rot_s2 = one_rad_s2 / 0.15915495;
    var one_krad_s2 = one_rad_s2 / 0.001;
    var aux_rad_s2;
    var aux_deg_s2;
    var aux_rot_s2;
    var aux_krad_s2;

    //lin
    var one_m_s2 = fullRot_IU * Math.pow(slow_loop, 2);
    var one_mm_s2 = one_m_s2 * 0.001;
    var one_um_s2 = one_m_s2 * 0.000001;
    var one_in_s2 = one_m_s2 / 39.370079;
    var one_ft_s2 = one_m_s2 / 3.280839895;
    var one_g = one_m_s2 * 9.80665;
    var aux_m_s2;
    var aux_mm_s2;
    var aux_um_s2;
    var aux_in_s2;
    var aux_ft_s2;
    var aux_g;

    if (inputUnits == "rad/s^2") {
      aux_IU = one_rad_s2 * inputValue;
    } else if (inputUnits == "deg/s^2") {
      aux_IU = one_deg_s2 * inputValue;
    } else if (inputUnits == "rot/s^2") {
      aux_IU = one_rot_s2 * inputValue;
    } else if (inputUnits == "krad/s^2") {
      aux_IU = one_krad_s2 * inputValue;
    } else if (inputUnits == "IU") {
      aux_IU = inputValue;
    } else if (inputUnits == "m/s^2") {
      aux_IU = one_m_s2 * inputValue;
    } else if (inputUnits == "mm/s^2") {
      aux_IU = one_mm_s2 * inputValue;
    } else if (inputUnits == "um/s^2") {
      aux_IU = one_um_s2 * inputValue;
    } else if (inputUnits == "in/s^2") {
      aux_IU = one_in_s2 * inputValue;
    } else if (inputUnits == "ft/s^2") {
      aux_IU = one_ft_s2 * inputValue;
    } else if (inputUnits == "g") {
      aux_IU = one_g * inputValue;
    }
    aux_rad_s2 = Number((aux_IU / one_rad_s2).toFixed(3));
    aux_deg_s2 = Number((aux_IU / one_deg_s2).toFixed(3));
    aux_rot_s2 = Number((aux_IU / one_rot_s2).toFixed(3));
    aux_krad_s2 = Number((aux_IU / one_krad_s2).toFixed(3));
    //lin
    aux_m_s2 = Number((aux_IU / one_m_s2).toFixed(3));
    aux_mm_s2 = Number((aux_IU / one_mm_s2).toFixed(3));
    aux_um_s2 = Number((aux_IU / one_um_s2).toFixed(3));
    aux_in_s2 = Number((aux_IU / one_in_s2).toFixed(3));
    aux_ft_s2 = Number((aux_IU / one_ft_s2).toFixed(3));
    aux_g = Number((aux_IU / one_g).toFixed(3));
    aux_IU = Number(aux_IU.toFixed(4));

    if (returnUnits == "IU") {
      return aux_IU.toString();
    } else if (returnUnits == "krad/s^2") {
      return aux_krad_s2.toString();
    } else if (returnUnits == "rot/s^2") {
      return aux_rot_s2.toString();
    } else if (returnUnits == "deg/s^2") {
      return aux_deg_s2.toString();
    } else if (returnUnits == "rad/s^2") {
      return aux_rad_s2.toString();
    } else if (returnUnits == "m/s^2") {
      return aux_m_s2.toString();
    } else if (returnUnits == "mm/s^2") {
      return aux_mm_s2.toString();
    } else if (returnUnits == "um/s^2") {
      return aux_um_s2.toString();
    } else if (returnUnits == "in/s^2") {
      return aux_in_s2.toString();
    } else if (returnUnits == "ft/s^2") {
      return aux_ft_s2.toString();
    } else if (returnUnits == "g") {
      return aux_g.toString();
    }
    return;
  }

  if (object_type == "time") {
    var aux_s;
    var aux_ms;

    if (inputUnits == "IU") {
      aux_IU = inputValue;
    } else if (inputUnits == "s") {
      aux_IU = inputValue * 1000;
    } else if (inputUnits == "ms") {
      aux_IU = inputValue;
    }

    aux_ms = Number(aux_IU.toFixed(3));
    aux_s = Number((aux_IU / 1000).toFixed(3));
    aux_IU = Math.floor(aux_IU);

    if (returnUnits == "IU") {
      return aux_IU.toString();
    } else if (returnUnits == "s") {
      return aux_s.toString();
    } else if (returnUnits == "ms") {
      return aux_ms.toString();
    }
    return;
  }
}

/*GetObject(index) - Finds an object/sub-object in the XML list*/
/*IN: 6041_1 //6040*/
/*OUT: ['6041_01', 'Statusword in Position Profile', '16'] */
function GetObject(index) {
  if (index.length > 4) {
    var aux = index.slice(4, 10);
    if (aux == "_00" || aux == "_0") {
      index = index.slice(0, 4);
    }
  }
  index = "#x".concat(index).toUpperCase();
  var aux_index = "??";
  var aux_title = "??";
  var aux_size = "??";
  //Searching SubItems
  if (index.length > 6) {
    index = index.split("");
    var aux = index.splice(6, 5);

    aux = check_validity_hex(aux.join(""), 16);
    if (aux.length == 1) {
      aux = "_0".concat(aux);
      index = index.join("").concat(aux);
    } else {
      aux = "_".concat(aux);
      index = index.join("").concat(aux);
    }
    for (var i = 0; i < All_Objects_g.length; i++) {
      var subItems_tmp = All_Objects_g[i].querySelectorAll("SubItem");
      if (subItems_tmp.length > 0) {
        for (var j = 0; j < subItems_tmp.length; j++) {
          if (subItems_tmp[j].children[0].innerHTML.toUpperCase() == index) {
            aux_index = index.slice(2, 10);
            if (subItems_tmp[j].querySelector("Name") != null) {
              aux_title = subItems_tmp[j].querySelector("Name").innerHTML;
            }
            if (subItems_tmp[j].querySelector("BitSize") != null) {
              aux_size = subItems_tmp[j].querySelector("BitSize").innerHTML;
            }
            var response = [aux_index, aux_title, aux_size];
            return response;
          }
        }
      }
    }
  }
  //Searching Regular Objects
  for (var i = 0; i < All_Objects_g.length; i++) {
    if (All_Objects_g[i].children[0].innerHTML.toUpperCase() == index) {
      aux_index = index.slice(2, 6);
      aux_title = All_Objects_g[i].querySelector("Name").innerHTML;
      aux_size = All_Objects_g[i].querySelector("BitSize").innerHTML;
      var isChilren = All_Objects_g[i].querySelectorAll("SubItem");
      if (isChilren.length != 0) {
        //Because the XML first Object sometimes has some stupid values like 144 Bits
        //the final value of obj will be the same as for obj_subindex 00
        aux_size = isChilren[0].querySelector("BitSize").innerHTML;
      }
      var response = [aux_index, aux_title, aux_size];
      return response;
    }
  }

  //Didnt find anything
  return [`${index.slice(2, 10)}`, "??", "0"];
}

/*------------------------------------*/
//
//   Function    : FG_object(obj)
//
//   Description : Returns the type of factor group that applies to an obj if
//    its included in any of the files from variables.js
//    It will return pos/spd/acc/time/jerk
//
/*   IN   : "6064" */
/*   OUT  : "spd"  */
//Remark: obj with subindex 1803_03
/*------------------------------------*/
function FG_object(obj) {
  obj = obj.toUpperCase();
  //if object is 6060_00 -remove _00
  if (obj.length > 4) {
    var aux = obj.slice(4, 10);
    if (aux == "_00") {
      obj = obj.slice(0, 4);
    }
  }

  for (var i = 0; i < Position_FG_array.length; i++) {
    if (Position_FG_array[i] == obj) {
      return "pos";
    }
  }
  for (var i = 0; i < Velocity_FG_array.length; i++) {
    if (Velocity_FG_array[i] == obj) {
      return "spd";
    }
  }
  for (var i = 0; i < Acceleration_FG_array.length; i++) {
    if (Acceleration_FG_array[i] == obj) {
      return "acc";
    }
  }
  for (var i = 0; i < Time_FG_array.length; i++) {
    if (Time_FG_array[i] == obj) {
      return "time";
    }
  }

  return "nothing";
}

/*******************************************************************************/
/*-------------------------CANopen supported protocols-------------------------*/
/*******************************************************************************/

/*CobID_who_dis(cob_id) - Determine what type of message and Axis ID*/
/*IN: CobID_who_dis("28a")*/
/*OUT:  ['PDO', 10, 'TPDO2'] */
/*Perfect COBID */
function CobID_who_dis(cob_id) {
  var axis_id = 0;

  if (cob_id.slice(0, 2).toUpperCase() == "0X") {
    cob_id = cob_id.slice(2, cob_id[cob_id.length]);
  }

  var temp = cob_id;
  if (temp.length > 3) {
    var uselessString = temp.slice(0, temp.length - 3);
    for (var j = 0; j < uselessString.length; j++) {
      if (uselessString[j] != "0") {
        return ["??"];
      }
    }
    cob_id = temp.slice(temp.length - 3, temp.length);
  }
  temp = check_validity_hex(cob_id, 16);
  if (cob_id != temp) {
    //if letters are passed as cobid
    return ["??"];
  }
  cob_id = hexToDec(cob_id, 16);

  if (cob_id == 0) {
    return (aux = ["NMT", "-", "NMT"]);
  }
  if (cob_id >= 1 && cob_id <= 31) {
    axis_id = cob_id - 1 + 1;
    return (aux = ["TCAN", axis_id, "Group-TCAN"]);
  }
  if (cob_id == 32) {
    return (aux = ["TCAN", "-", "SYNC-TCAN"]);
  }

  if (cob_id >= 65 && cob_id <= 95) {
    axis_id = cob_id - 65 + 1;
    return (aux = ["TCAN", axis_id, "PVT-TCAN"]);
  }
  if (cob_id >= 257 && cob_id <= 287) {
    axis_id = cob_id - 257 + 1;
    return (aux = ["TCAN", axis_id, "TakeData2-TCAN"]);
  }
  if (cob_id >= 289 && cob_id <= 319) {
    axis_id = cob_id - 289 + 1;
    return (aux = ["TCAN", axis_id, "Normal-TCAN"]);
  }
  if (cob_id >= 321 && cob_id <= 351) {
    axis_id = cob_id - 321 + 1;
    return (aux = ["TCAN", axis_id, "Host-TCAN"]);
  }
  if (cob_id >= 353 && cob_id <= 383) {
    axis_id = cob_id - 353 + 1;
    return (aux = ["TCAN", axis_id, "TakeData-TCAN"]);
  }
  if (cob_id == 128) {
    return (aux = ["SYNC", "-", "SYNC"]);
  }

  if (cob_id >= 129 && cob_id <= 255) {
    axis_id = cob_id - 129 + 1;
    return (aux = ["EMCY", axis_id, "EMCY"]);
  }
  if (cob_id == 256) {
    return (aux = ["TIME", "-"]);
  }
  if (cob_id >= 385 && cob_id <= 511) {
    axis_id = cob_id - 385 + 1;
    return (aux = ["PDO", axis_id, "TPDO1"]);
  }

  if (cob_id == 512) {
    return (aux = ["TCAN", "-", "Broadcast-TCAN"]);
  }
  if (cob_id >= 513 && cob_id <= 639) {
    axis_id = cob_id - 513 + 1;
    return (aux = ["PDO", axis_id, "RPDO1"]);
  }
  //
  if (cob_id >= 641 && cob_id <= 767) {
    axis_id = cob_id - 641 + 1;
    return (aux = ["PDO", axis_id, "TPDO2"]);
  }
  if (cob_id >= 769 && cob_id <= 895) {
    axis_id = cob_id - 769 + 1;
    return (aux = ["PDO", axis_id, "RPDO2"]);
  }
  //
  if (cob_id >= 897 && cob_id <= 1023) {
    axis_id = cob_id - 897 + 1;
    return (aux = ["PDO", axis_id, "TPDO3"]);
  }
  if (cob_id >= 1025 && cob_id <= 1151) {
    axis_id = cob_id - 1025 + 1;
    return (aux = ["PDO", axis_id, "RPDO3"]);
  }
  //
  if (cob_id >= 1153 && cob_id <= 1279) {
    axis_id = cob_id - 1153 + 1;
    return (aux = ["PDO", axis_id, "TPDO4"]);
  }
  if (cob_id >= 1281 && cob_id <= 1407) {
    axis_id = cob_id - 1281 + 1;
    return (aux = ["PDO", axis_id, "RPDO4"]);
  }
  if (cob_id >= 1409 && cob_id <= 1535) {
    axis_id = cob_id - 1409 + 1;
    return (aux = ["SDO", axis_id, "T_SDO"]);
  }
  if (cob_id >= 1537 && cob_id <= 1663) {
    axis_id = cob_id - 1537 + 1;
    return (aux = ["SDO", axis_id, "R_SDO"]);
  }

  if (cob_id >= 1793 && cob_id <= 1919) {
    axis_id = cob_id - 1793 + 1;
    return (aux = ["NMT_Monitoring", axis_id, "NMT_Monitoring"]);
  }
  if (cob_id >= 2020 && cob_id <= 2021) {
    return (aux = ["LSS", "R/T", "LSS"]);
  }
  return (aux = ["??"]);
}

function NMT_who_dis(cobid, data) {
  var aux_cobid = CobID_who_dis(cobid);

  var helping_info = "";
  var error_status = 0;

  if (data.length > 4) {
    helping_info = "DATA too big for this type of message";
    error_status = 1;
    axis_id = "??";
    cs = "-";
  } else if (data.length < 4) {
    helping_info = "DATA too short for this type of message";
    error_status = 1;
    axis_id = "??";
    cs = "-";
  }
  if (error_status == 0) {
    //No errors
    var cs = data.slice(0, 2);
    var axis_id = hexToDec(data.slice(2, 4), 16);

    if (cs == "80") {
      helping_info = "Enter Pre-Operational";
    } else if (cs == "82") {
      helping_info = "Reset Communication";
    } else if (cs == "81") {
      helping_info = "Reset Node";
    } else if (cs == "01") {
      helping_info = "Start Remote Node";
    } else if (cs == "02") {
      helping_info = "Stop Remote Node";
    } else {
      helping_info = "Unknown Command Specifier ";
      error_status = 1;
    }

    if (axis_id < 0 || axis_id > 127) {
      helping_info = "Axis ID is not included between 0 and 127";
      error_status = 1;
      axis_id = "??";
    } else if (axis_id == 0) {
      axis_id = "All Axes";
    }
  }

  return [
    cobid,
    data,
    aux_cobid[0],
    axis_id,
    cs,
    "-",
    "-",
    "-",
    helping_info,
    error_status,
  ];
}

function ABORT_who_dis(data) {
  switch (data) {
    case "05030000":
      aux = `toggle bit not changed: Valid only with "normal transfer" or "block transfer".
       The bit, which is to alternate after each transfer, did not change its state.";`;
      break;
    case "05040000":
      aux =
        "command specifier unknown: Byte 0 of the data block contains a command that is not allowed. ";
      break;
    case "05040001":
      aux = "Client/server command specifier not valid or unknown";
      break;
    case "06010000":
      aux = `Unsupported access to an object. lf "complete access" was requested via CAN over EtherCAT (CoE) (is not supported.) `;
      break;
    case "06010002":
      aux = `read only entry: An attempt was made to write to a constant or read-only object. `;
      break;

    case "06020000":
      aux =
        "object not existing: An attempt was made to access a non-existing object (index incorrect).";
      break;
    case "06040041":
      aux =
        "object cannot be pdo mapped: An attempt was made to map an object in the PDO for which that is not permissible";
      break;
    case "06040042":
      aux =
        "mapped pdo exceed pdo: lf the desired object were to be attached to the PDO mapping, the 8 bytes of the PDO mapping would be exceeded";
      break;
    case "06040043":
      aux = "General parameter incompatibility reason";
      break;
    case "06040047":
      aux = "General internal incompatibility error in the device";
      break;
    case "06070010":
      aux =
        "Data type does not match, length of service parameter does not match";
      break;
    case "06070012":
      aux =
        "parameter length too long: An attempt was made to write to an object with too much data; for example, with <CMD>=23h (4 bytes) to an object of type Unsigned8, <CMD>=2Fh would be correct.";
      break;
    case "06070013":
      aux =
        "parameter length too short: At attempt was made to write to an object with too little data; for example, with <CMD>=2Fh (1 byte) to an object of type Unsigned32, <CMD>=23h would be correct. ";
      break;
    case "06090011":
      aux =
        "	subindex not existing: An attempt was made to access an invalid subindex of an object; the index, on the other hand, would exist. ";
      break;
    case "06090030":
      aux = "Value range of parameter exceeded (only for write access)";
      break;
    case "06090031":
      aux = `value too great: Same objects are subject to restrictions in the size of the value; in this case, an attempt was made to write an excessively large value to the object. For example, the "Pre-defined error field: Number of errors" object for 1003h:00 may only be set to the value "0"; all other numerical values result in this error. `;
      break;
    case "06090032":
      aux =
        "	value too small: Same objects are subject to restrictions in the size of the value. In this case, an attempt was made to write a value that is too small to the object.";
      break;
    case "08000000":
      aux =
        "general error: General error that does not fit in any other category.";
      break;
    case "08000020":
      aux = "Data cannot be transferred or stored to the application";
      break;
    case "08000021":
      aux =
        "Data cannot be transferred or stored to the application because of local control";
      break;
    case "08000022":
      aux = `Data cannot be transferred or stored to the application because of the present device state: The parameters of the PD Os may only be changed in the "Stopped" or "Pre-Operational" state. Write access of objects 1400h to 1407h, 1600h to 1607h, 1800h to 1807h and 1A00h to 1A07h is not permissible in the "Operational" state.`;
      break;
    default:
      aux = "Unknown Abort Code";
      break;
  }

  return aux;
}

function EMCY_who_dis(cobid, data) {
  var aux_cobid = CobID_who_dis(cobid);

  var helping_info = "";
  var error_status = 1;
  var aux_data = data;

  var aux_return = [];

  aux_data = removeSpaces(aux_data);
  var error_code = data.slice(0, 4);
  error_code = L2B_endian(error_code);
  aux_return[0] = error_code;

  switch (error_code) {
    case "0000":
      aux_return[1] = "Error Reset or No Error";
      break;
    case "1000":
      aux_return[1] =
        "Generic Error; sent when a communication error occurs on CAN (object 2000h bit0=1; usually followed by EMCY code 0x7500";
      break;
    case "2310":
      aux_return[1] = "Continuous over-current";
      break;
    case "2340":
      aux_return[1] = "Short-circuit";
      break;
    case "3210":
      aux_return[1] = "DC-link over-voltage";
      break;
    case "3220":
      aux_return[1] = "DC-link under-voltage";
      break;
    case "4280":
      aux_return[1] = "Over temperature motor";
      break;
    case "4310":
      aux_return[1] = "Over temperature drive";
      break;
    case "5441":
      aux_return[1] = "Drive disabled due to enable or STO input";
      break;
    case "5442":
      aux_return[1] = "Negative limit switch active";
      break;
    case "5443":
      aux_return[1] = "Positive limit switch active";
      break;
    case "6100":
      aux_return[1] = "Invalid setup data";
      break;
    case "7300":
      aux_return[1] = "Sensor error";
      break;
    case "7500":
      aux_return[1] = "Communication error";
      break;
    case "8110":
      aux_return[1] = "CAN overrun (message lost)";
      break;
    case "8210":
      aux_return[1] =
        "Assuming - the PDO lengh you trying to write to is not correct";
      break;
    case "8130":
      aux_return[1] = "Life guard error or heartbeat error";
      break;
    case "8331":
      aux_return[1] = "I2t protection triggered";
      break;
    case "8580":
      aux_return[1] = "Position wraparound";
      break;
    case "8611":
      aux_return[1] = "Control error / Following error ";
      break;
    case "9000":
      aux_return[1] = "Command error";
      break;
    case "FF01":
      aux_return[1] =
        "Generic interpolated position mode error (PVT / PT error)";
      break;
    case "FF02":
      aux_return[1] = "Change set acknowledge bit wrong value";
      break;
    case "FF03":
      aux_return[1] = "Specified homing method not available";
      break;
    case "FF04":
      aux_return[1] = "A wrong mode is set in object 6060h, modes of operation";
      break;
    case "FF05":
      aux_return[1] = "Specified digital I/O line not available";
      break;
    case "FF06":
      aux_return[1] = "Positive software position limit triggered";
      break;
    case "FF07":
      aux_return[1] = "Negative software position limit triggered";
      break;
    case "FF08":
      aux_return[1] = "Enable circuit hardware error";
      break;
    default:
      aux_return[1] = "Unknown EMCY message";
      break;
  }
  var obj;
  var obj_name;
  var obj_data;
  if (error_code == "7500") {
    obj = "1001 / 2003";
    obj_name = `${GetObject(1001)[1]} / ${GetObject(2003)[1]}`;
    obj_data = `${data.slice(4, 6)} / ${L2B_endian(data.slice(6, 10))}`;
  } else if (error_code == "7300") {
    obj = "1001 / 2009";
    obj_name = `${GetObject(1001)[1]} / ${GetObject(2009)[1]}`;
    obj_data = `${data.slice(4, 6)} / ${L2B_endian(data.slice(6, 10))}`;
  } else if (error_code == "FF01") {
    obj = "1001 / 2072";
    obj_name = `${GetObject(1001)[1]} / ${GetObject(2072)[1]}`;
    obj_data = `${data.slice(4, 6)} / ${L2B_endian(data.slice(6, 10))}`;
  } else {
    obj = "1001";
    obj_name = `${GetObject(1001)[1]}`;
    obj_data = `${data.slice(4, 6)} `;
  }

  return [
    cobid,
    data,
    aux_cobid[0],
    aux_cobid[1],
    error_code,
    obj,
    obj_name,
    obj_data,
    aux_return[1],
    error_status,
  ];
}
// [CobID[0], DATA[1], type[2], axisID[3], CS[4], object_subindex[5],
//object_name[6], DATA_good[7], FG_info[8], error_toggle[9]  ]
function NMT_Monitoring_who_dis(cobid, data) {
  //Possible bug for NodeGuarding protocol
  //the CMD is one byte and bit 7 alternates between 1 and 0
  var aux_cobid = CobID_who_dis(cobid);

  var helping_info = "";
  var error_status = 0;

  if (data.length > 2) {
    error_status = 1;
    helping_info = "DATA too big for this type of message";
  }
  if (error_status == 0) {
    if (data == "") {
      helping_info = "RTR request from master";
    } else {
      switch (data) {
        case "05":
        case "5":
          helping_info = "NMT Operational";
          break;
        case "04":
        case "4":
          helping_info = "NMT Stopped";
          break;
        case "7F":
          helping_info = "NMT Pre-Operational";
          break;
        case "00":
          helping_info = "Boot Up";
          break;
        case "0":
          //we are making an assumption that the 0 means the length of the message
          helping_info = "RTR request from master";
          break;
        default:
          helping_info = "Unknown NMT state for the slave";
          error_status = 1;
          break;
      }
    }
  }
  return [
    cobid,
    data,
    aux_cobid[0],
    aux_cobid[1],
    data,
    "-",
    "-",
    "-",
    helping_info,
    error_status,
  ];
}
/****************************************/
/*IDK yet */
/***************************************/

function removeSpaceElementsFromArray(arr) {
  var regex1 = /^\s+$/g;
  var regex2 = "";
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].match(regex1) || arr[i] == "") {
      arr.splice(i, 1);
      i--;
    }
  }

  return arr;
}
function removeNonHexElementsFromArray(arr) {
  if (typeof arr == "string") {
    arr = [arr];
  }
  var numberPattern = /^(0x)?[0-9a-f]+$/gi;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].match(numberPattern) == null) {
      arr.splice(i, 1);
      i--;
    }
  }

  return arr;
}

/****************************************/
/*Functions for Strings***/
/***************************************/
//in:one string ; out:arr of elemements separated by "something"
function separateArrBy2Quotes(arr) {
  var aux = [];
  var j = 0;

  if (typeof arr == "string") {
    var a = arr.match(/[^"]+/gm);
    a = removeAnnoyingElementsFromArray(a);

    return a;
  }
}
function separateArrByComma(arr) {
  var aux = [];
  var j = 0;

  //removing the possible commas inside the array, if they are inside quotes
  arr = arr.split("");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == `"`) {
      for (var j = i; j < arr.length; j++) {
        if (arr[j] == `"`) {
          var aux = arr.slice(i, j);
          for (var k = 0; k < aux.length; k++) {
            if (arr[k + i] == ",") {
              arr[k + i] = ".";
            }
            if (k == aux.length - 1) {
              i = j + 1;
              j = arr.length;
            }
          }
        }
      }
    }
  }
  arr = arr.join("");
  if (typeof arr == "string") {
    var a = arr.match(/[^,]+/gm);
    a = removeAnnoyingElementsFromArray(a);

    return a;
  }
}
function separateArrBySpace(arr) {
  var aux = [];
  var j = 0;

  if (typeof arr == "string") {
    var a = arr.match(/[^ ]+/gm);
    a = removeAnnoyingElementsFromArray(a);

    return a;
  }
}

//returns an array which every element will go through an operation specified in string ww
//ex: operation([1,2,3,4], valoareaMasii/2);
//inp for arr: only Nr or array of NR
function operation(arr, ww) {
  if (typeof arr == "number") {
    ww = ww.split("");
    const aux = [];
    let j = 0;

    for (var i = 0; i < ww.length; i++) {
      if (ww[i].match(/[a-z]|[A-Z]/g) != null) {
        aux[j] = i; //returns an array with the index of the letters of ww
        j++;
      }
    }

    //checking if the letters are in order
    for (var i = 1; i < aux.length; i++) {
      if (aux[i] - aux[i - 1] != 1) {
        return errorDisp(
          document.querySelector("body"),
          "Please write a correct formula for the operation function"
        );
      }
    }

    ww.splice(aux[0], aux.length, `${arr}`);
    ww = ww.join(``);
    arr = eval(ww);
    return arr;
  } else if (typeof arr == "object") {
    arr = arr.map((x) => {
      return operation(x, ww);
    });
    return arr;
  } else if (typeof arr == "string") {
    return operation(parseInt(arr), ww);
  }
}
