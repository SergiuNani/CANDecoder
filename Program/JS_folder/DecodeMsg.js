//bug -  what if msg len is not correct because the machine dont give me all my zeros
//check data, not cobid
function DecodeOneMsg_global(cobid, data) {
  var aux_cobid = CobID_who_dis(cobid);
  data = check_validity_hex(data, 64).toUpperCase();
  if (aux_cobid[0] == "SDO") {
    return DecodeOne_SDO_global(cobid, data);
  } else if (aux_cobid[0] == "EMCY") {
    return EMCY_who_dis(cobid, data);
  } else if (aux_cobid[0] == "PDO") {
    return DecodeOne_PDO_global(cobid, data);
  } else if (aux_cobid[0] == "NMT") {
    return NMT_who_dis(cobid, data);
  } else if (aux_cobid[0] == "NMT_Monitoring") {
    return NMT_Monitoring_who_dis(cobid, data);
  } else if (aux_cobid[0] == "SYNC") {
    if (data == "" || data == "0") {
      helping_info = "Sync message";
    } else {
      helping_info = "Data should be nothing, however this is still OK";
    }
    return [
      cobid,
      data,
      "SYNC",
      "All Axes",
      "-",
      `-`,
      `-`,
      `-`,
      helping_info,
      0,
    ];
  } else if (aux_cobid[0] == "TCAN") {
    if (aux_cobid[2] == "SYNC-TCAN" || aux_cobid[2] == "Broadcast-TCAN") {
      aux_cobid[1] = "All Axes";
    }
    return [
      cobid,
      data,
      "TCAN",
      aux_cobid[1],
      "-",
      `-`,
      `-`,
      `-`,
      aux_cobid[2],
      0,
    ];
  }
  return ["x", "x"];
}
// [CobID[0], DATA[1], type[2], axisID[3], CS[4], object_subindex[5],
//object_name[6], DATA_good[7], FG_info[8], error_toggle[9]  ]
function delayFCT(cobid, data) {
  setTimeout(() => {
    DecodeOneMsg_global(cobid, data);
  }, 200);
}
var SegmentedRead_flag = 0;

function DecodeOne_SDO_global(cobid, data) {
  var aux_cobid = CobID_who_dis(cobid);

  var helping_info = "";
  var error_status = 0;
  var aux_data = data;

  aux_data = aux_data.toUpperCase();

  if (aux_data.length < 8) {
    //if data length lower than 4 bytes
    return [
      cobid,
      data,
      aux_cobid[2],
      aux_cobid[1],
      "??",
      "??",
      "??",
      aux_data,
      "SDO message not complete",
      1,
    ];
  }

  var aux_cs = aux_data.slice(0, 2);
  var aux_object = aux_data.slice(2, 6);
  var aux_subindex = aux_data.slice(6, 8);
  var aux_data = aux_data.slice(8, 16);
  aux_object = L2B_endian(aux_object);

  aux_object = `${aux_object}_${aux_subindex}`;
  var getObj = GetObject(aux_object);
  var getFG_obj = FG_object(aux_object);
  aux_data = L2B_endian(aux_data);

  //Segmented Read in case the SDO structure is not respected
  if (SegmentedRead_flag) {
    SegmentedRead_flag = 0;
    if (aux_cs != "80") {
      helping_info = hex_to_ascii(data);
      return [
        cobid,
        data,
        aux_cobid[2],
        aux_cobid[1],
        "??",
        "??",
        "??",
        data,
        helping_info,
        0,
      ];
    }
  }

  if (aux_cobid[2] == "T_SDO" && aux_data.length != 8) {
    //All T_PDO messages must be 64 bits
    aux_data = aux_data.padStart(8, "0");
  }

  if (
    getObj[1] == "??" &&
    !(["60", "70"].includes(aux_cs) && aux_cobid[2] == "R_SDO")
  ) {
    //segmented readig bs
    helping_info = "Invalid Object";
  }

  if (helping_info == "") {
    //All error conditions for Command Specifier
    switch (aux_cs) {
      case "43":
        if (getObj[2] != 32) {
          helping_info = " '43' - Invalid CS for this object ";
        }
        break;
      case "4B":
        if (getObj[2] != 16) {
          helping_info = " '4B' - Invalid CS for this object ";
        }
        break;
      case "47":
        helping_info = " '47' - Invalid CS for this object ";
        break;
      case "4F":
        if (getObj[2] != 8) {
          helping_info = " '4F' - Invalid CS for this object ";
        }
        break;
      case "40":
        if (aux_cobid[2] == "T_SDO") {
          helping_info = "'40' - Invalid CS for this object ";
        }
        break;

      case "41":
        if (aux_cobid[2] == "R_SDO") {
          helping_info = "'41' - Invalid CS for RSDO ";
        } else {
          if (parseInt(aux_data) != 0) {
            helping_info =
              "DATA needs to be '00 00 00 00' confirming a response to Segmented Read OK";
          }
        }
        break;
      case "23":
        if (getObj[2] != 32) {
          helping_info = " '23' - Invalid CS for this object ";
        } else if (aux_cobid[2] == "T_SDO") {
          helping_info = "Invalid CS";
        } else if (aux_cobid[2] == "R_SDO" && aux_data.length != 8) {
          aux_data = aux_data.padStart(8, "0");
        }
        break;
      case "2B":
        if (getObj[2] != 16) {
          helping_info = " '2B' - Invalid CS for this object ";
        } else if (aux_cobid[2] == "T_SDO") {
          helping_info = "Invalid CS";
        } else if (aux_cobid[2] == "R_SDO" && aux_data.length != 4) {
          if (aux_data.length > 4) {
            var temp = parseInt(aux_data.slice(0, aux_data.length - 4));
            if (temp == 0) {
              aux_data = aux_data.slice(aux_data.length - 4, aux_data.length);
            } else {
              helping_info = "Data too long for this object";
            }
          } else {
            aux_data = aux_data.padStart(4, "0");
          }
        }
        break;
      case "27":
        helping_info = " '27' - Invalid CS for this object ";

        break;
      case "2F":
        if (getObj[2] != 8) {
          helping_info = " '2F' - Invalid CS for this object ";
        } else if (aux_cobid[2] == "T_SDO") {
          helping_info = "Invalid CS";
        } else if (aux_cobid[2] == "R_SDO" && aux_data.length != 2) {
          if (aux_data.length > 2) {
            var temp = parseInt(aux_data.slice(0, aux_data.length - 2));
            if (temp == 0) {
              aux_data = aux_data.slice(aux_data.length - 2, aux_data.length);
            } else {
              helping_info = "Data too long for this object";
            }
          } else {
            aux_data = aux_data.padStart(2, "0");
          }
        }
        break;
      case "60":
        if (aux_cobid[2] == "T_SDO") {
          if (parseInt(aux_data) != 0) {
            helping_info =
              "DATA needs to be '00 00 00 00' confirming a response to Write OK";
          }
        } else {
          if (parseInt(aux_data) != 0 || parseInt(aux_object) != 0) {
            helping_info =
              "Message needs to be '60 00 00 00 00 00 00 00' requesting a Segmented Read";
          }
          SegmentedRead_flag = 1;
        }
        break;
      case "70":
        if (aux_cobid[2] == "T_SDO") {
          helping_info = "Invalid CS";
        } else {
          if (parseInt(aux_data) != 0 || parseInt(aux_object) != 0) {
            helping_info =
              "Message needs to be '70 00 00 00 00 00 00 00' requesting a Segmented Read";
          }
          SegmentedRead_flag = 1;
        }
        break;
      case "80":
        if (aux_cobid[2] == "T_SDO") {
          helping_info = ABORT_who_dis(aux_data);
        } else {
          helping_info = "Invalid CS";
        }
        break;
      default:
        helping_info = "Invalid CS";
        break;
    }
  }

  if (helping_info != "") {
    error_status = 1;
  }
  if (getFG_obj != "nothing" && error_status == 0) {
    var aux_FG_value = aux_data;
    var units;

    aux_FG_value = hexToDec(aux_FG_value, 32);

    if (dom("body").classList.contains("FactorGroupEnabled")) {
      //FG enabled

      if (getFG_obj == "time") {
        units = FG_time_units.value;
      } else if (getFG_obj == "spd") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_spd_rot.value;
        } else {
          units = FG_spd_lin.value;
        }
      } else if (getFG_obj == "acc") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_acc_rot.value;
        } else {
          units = FG_acc_lin.value;
        }
      } else if (getFG_obj == "pos") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_pos_rot.value;
        } else {
          units = FG_pos_lin.value;
        }
      }
    } else {
      if (getFG_obj == "time") {
        units = FG_time_units_p.value;
      } else if (getFG_obj == "spd") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_spd_rot_p.value;
        } else {
          units = FG_spd_lin_p.value;
        }
        aux_FG_value = aux_FG_value / 65536;
      } else if (getFG_obj == "acc") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_acc_rot_p.value;
        } else {
          units = FG_acc_lin_p.value;
        }
        aux_FG_value = aux_FG_value / 65536;
      } else if (getFG_obj == "pos") {
        if (dom("body").classList.contains("Rotary_class")) {
          units = FG_pos_rot_p.value;
        } else {
          units = FG_pos_lin_p.value;
        }
      }

      //value in DEC
      aux_FG_value = UnitsConvertor(
        aux_FG_value,
        "IU",
        units,
        OneRot_IU_value.value,
        aux_object
      );
    }
    if (helping_info == "") {
      helping_info = `${aux_FG_value} ${units}`;
    }
    if (aux_cs == "60" && aux_cobid[2] == "T_SDO") {
      //rewriting FG units in case of T_SDO confiming OK write
      helping_info = "Confirming a successful Write";
    }
  }

  if (helping_info == "") {
    helping_info = inDepthSDOHelpingInfo(
      aux_cobid[2],
      aux_cs,
      aux_object,
      aux_data
    );
  }

  /*-------------------------------------------------------*/
  //SIDE QUEST - if this SDO is mapping a PDO - announce it
  var temp_aux = getObj[0].slice(0, 2);
  var temp_aux2 = getObj[0].slice(2, 4);
  if (
    ["16", "1A"].includes(temp_aux) &&
    ["00", "01", "02", "03"].includes(temp_aux2) &&
    aux_cobid[2] == "R_SDO" &&
    error_status == 0 &&
    getObj[0].length > 4
  ) {
    //excludes 1600_00 because its gon be shown as 1600 , etc
    var mapping_obj = GetObject(
      `${aux_data.slice(0, 4)}_${aux_data.slice(4, 6)}`
    );
    if (
      mapping_obj[1] != "??" &&
      hexToDec(aux_data.slice(6, 8), 16) == mapping_obj[2]
    ) {
      //Checking that the object that is about to be mapped exists and the length is selected correctly
      var dummy_array = [];
      var subindex_aux = parseInt(getObj[0].slice(5, 7)) - 1;
      var index = [aux_cobid[1] - 1];

      if (temp_aux == "16") {
        //RPDO
        var temp = `RPDO_${parseInt(temp_aux2) + 1}`;
      } else {
        var temp = `TPDO_${parseInt(temp_aux2) + 1}`;
      }

      if (window[temp][index] == "") {
        dummy_array[subindex_aux] = mapping_obj[0];
        window[temp][index] = dummy_array;
      } else {
        window[temp][index][subindex_aux] = mapping_obj[0];
      }
    }
  }
  return [
    cobid,
    data,
    aux_cobid[2],
    aux_cobid[1],
    aux_cs,
    getObj[0],
    getObj[1],
    aux_data,
    helping_info,
    error_status,
  ];
}

function inDepthSDOHelpingInfo(cob_idType, aux_cs, aux_object, aux_data) {
  var helping_info = "";

  switch (aux_object) {
    case "6060_00":
      switch (aux_data) {
        case "FE":
          helping_info = "Electronic Camming Mode";
          break;
        case "FF":
          helping_info = "Electronic Gearing Mode";
          break;
        case "01":
          helping_info = "Profile Position Mode";
          break;
        case "03":
          helping_info = "Profile Velocity Mode";
          break;
        case "04":
          helping_info = "Profile Torque Mode";
          break;
        case "06":
          helping_info = "Homing Mode";
          break;
        case "07":
          helping_info = "Interpolated Position Mode";
          break;
        case "08":
          helping_info = "Cyclyc sync Position Mode";
          break;
        case "09":
          helping_info = "Cyclyc sync Velocity Mode";
          break;
        case "0A":
          helping_info = "Cyclyc sync Torque Mode";
          break;
        default:
          helping_info = "Unkown Mode";
          break;
      }
      break;
    case "1018_02":
      //Product ID
      helping_info = hexToDec(aux_data, 32);
      break;
    case "1018_04":
      //serial number
      var temp = aux_data.slice(0, 4);
      helping_info = `${hex_to_ascii(temp)}${aux_data.slice(4, 8)}`;

      break;
    default:
      helping_info = "";
      break;
  }

  if (helping_info == "") {
    switch (aux_cs) {
      case "23":
      case "27":
      case "2B":
      case "2F":
        helping_info = "Write Request";
        break;
      case "43":
      case "47":
      case "4B":
      case "4F":
      case "40":
        if (cob_idType == "T_SDO") {
          helping_info = "Read Response ";
        } else {
          helping_info = "Read Request ";
        }
        break;
      case "41":
        var temp = hexToDec(aux_data, 32);
        helping_info = `Segmented info - ${temp} bytes long`;

        break;
      case "60":
      case "70":
        if (cob_idType == "T_SDO") {
          helping_info = "Confirming Write request ";
        } else {
          helping_info = "Read Segmented Data";
          SegmentedRead_flag = 1;
        }
        break;

      default:
        helping_info = "";
        break;
    }
  }
  return helping_info;
}

function DecodeOne_PDO_global(cobid, data) {
  var aux_cobid = CobID_who_dis(cobid);
  var helping_info = "";
  var error_status = 0;
  var aux_data = data;

  aux_data = aux_data.toUpperCase();

  var aux_pdo_type = aux_cobid[2].slice(0, 4) + "_" + aux_cobid[2].slice(4);
  var mapped_objects = window[`${aux_pdo_type}`][aux_cobid[1] - 1];
  var value_arr = [];
  var helping_info_arr = [];
  var nr_mapped_obj = mapped_objects.length;

  var obj_name_arr = [];
  //If there is the PDO_detected_UI then wait
  if (!PDO_detected_main_UI.classList.contains("none")) {
    delayFCT(cobid, data);
    return;
  }

  if (mapped_objects == "") {
    //If no objects have been mapped
    CreatePdoDetectedWindow(cobid, data);
    delayFCT(cobid, data);

    return;
  }

  mapped_objects.forEach((obj, index) => {
    if (obj.slice(4, 7) == "_00") {
      mapped_objects[index] = obj.slice(0, 4);
    }
  });
  for (var i = 0; i < nr_mapped_obj; i++) {
    var helping_info = " - ";
    helping_info_arr[i] = helping_info;

    var obj_len = GetObject(mapped_objects[i]);
    obj_name_arr[i] = obj_len[1];
    obj_len = obj_len[2] / 4;

    //Data string too long
    value_arr[i] = L2B_endian(aux_data.slice(0, obj_len));
    aux_data = aux_data.slice(obj_len);
    //Data string too short
    if (obj_len != value_arr[i].length) {
      value_arr[i] = value_arr[i].padStart(obj_len, "0");
    }

    //If object is  influenced by Factor Group-------
    var getFG_obj = FG_object(mapped_objects[i]);

    if (getFG_obj != "nothing") {
      var aux_FG_value = value_arr[i];
      var units;

      aux_FG_value = hexToDec(aux_FG_value, 32);

      if (dom("body").classList.contains("FactorGroupEnabled")) {
        //FG enabled

        if (getFG_obj == "time") {
          units = FG_time_units.value;
        } else if (getFG_obj == "spd") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_spd_rot.value;
          } else {
            units = FG_spd_lin.value;
          }
        } else if (getFG_obj == "acc") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_acc_rot.value;
          } else {
            units = FG_acc_lin.value;
          }
        } else if (getFG_obj == "pos") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_pos_rot.value;
          } else {
            units = FG_pos_lin.value;
          }
        }
      } else {
        if (getFG_obj == "time") {
          units = FG_time_units_p.value;
        } else if (getFG_obj == "spd") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_spd_rot_p.value;
          } else {
            units = FG_spd_lin_p.value;
          }
          aux_FG_value = aux_FG_value / 65536;
        } else if (getFG_obj == "acc") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_acc_rot_p.value;
          } else {
            units = FG_acc_lin_p.value;
          }
          aux_FG_value = aux_FG_value / 65536;
        } else if (getFG_obj == "pos") {
          if (dom("body").classList.contains("Rotary_class")) {
            units = FG_pos_rot_p.value;
          } else {
            units = FG_pos_lin_p.value;
          }
        }

        //value in DEC
        aux_FG_value = UnitsConvertor(
          aux_FG_value,
          "IU",
          units,
          OneRot_IU_value.value,
          mapped_objects[i]
        );
      }

      helping_info = `${aux_FG_value} ${units}`;

      helping_info_arr[i] = helping_info;
    }

    //---------------------------------
  }

  mapped_objects = mapped_objects.join(" / ");

  value_arr = value_arr.join(" / ");
  obj_name_arr = obj_name_arr.join(" / ");
  helping_info_arr = helping_info_arr.join(" / ");

  return [
    cobid,
    data,
    aux_cobid[2],
    aux_cobid[1],
    nr_mapped_obj,
    mapped_objects,
    obj_name_arr,
    value_arr,
    helping_info_arr,
    error_status,
  ];
}

//-------------PDO detected window functionality--------------------//
function CreatePdoDetectedWindow(cobid, data) {
  PDO_detected_main_UI.classList.remove("none");
  aux_cobid = CobID_who_dis(cobid);
  var real_pdo_var = aux_cobid[2].slice(0, 4) + "_" + aux_cobid[2].slice(4);
  if (window[`${real_pdo_var}`][aux_cobid[1] - 1] != "") {
    //IF the obj have been mapped -do nothing
    PDO_detected_main_UI.classList.add("none");
    return;
  }
  PDO_detect_axisID.innerText = aux_cobid[1];
  PDO_detect_cobID.innerText = `${cobid} - ${aux_cobid[2]}`;
  if (data.length > 16) {
    data = data.slice(0, 16);
  }
  if (data.length % 2 != 0) {
    data = "0" + data;
  }
  PDO_detect_data.innerText = data;

  close_PDO_detected_main_UI.addEventListener("click", () => {
    //fct that does nothing
    PDO_detected_main_UI.classList.add("none");
  });

  //In PDO_detected_options_menu, filing some text like RPDO4
  PDO_detected_options_menu.querySelector(".PDOdetected_CobidType").innerText =
    aux_cobid[2];

  PDO_detected_options_menu.querySelector(".PDOdetected_CobidType1").innerText =
    aux_cobid[2];

  //Setting the default settings
  document.getElementsByName("PDO_detected")[0].checked = "checked";
  PDO_detect_obj1.value = "";
  PDO_detect_obj_subindex_1.value = "00";
  PDO_detect_obj2.value = "";
  PDO_detect_obj_subindex_2.value = "00";
  PDO_detect_obj3.value = "";
  PDO_detect_obj_subindex_3.value = "00";
  PDO_detect_obj4.value = "";
  PDO_detect_obj_subindex_4.value = "00";

  if (multiple_pdo_incoming == 1 && get_rid_of_PDO_detected_g == 1) {
    //skipping all the incoming PDOs and putting random mapped objects
    document.getElementsByName("PDO_detected")[4].checked = "checked";
    PDO_detected_MenuToggle();
    PDO_MAP();
  }
}
//Purpose: In PDO_detected_UI there are 6 options -this fct exploits not all of them
function PDO_detected_MenuToggle() {
  var radio_options = document.getElementsByName("PDO_detected");
  var cobid = PDO_detect_cobID.innerText.split(" - ")[0];
  cobid = CobID_who_dis(cobid);
  var msgLen = PDO_detect_data.innerText;

  msgLen = msgLen.length * 4;

  //DEFAULT OPTION SELECTED
  if (radio_options[1].checked) {
    PDO_detect_obj3.value = "";
    PDO_detect_obj_subindex_3.value = "00";
    PDO_detect_obj4.value = "";
    PDO_detect_obj_subindex_4.value = "00";
    var aux_array = [];
    if (cobid[2] == "RPDO1") {
      aux_array = RPDO_1_pdo_default;
    } else if (cobid[2] == "RPDO2") {
      aux_array = RPDO_2_pdo_default;
    } else if (cobid[2] == "RPDO3") {
      aux_array = RPDO_3_pdo_default;
    } else if (cobid[2] == "RPDO4") {
      aux_array = RPDO_4_pdo_default;
    } else if (cobid[2] == "TPDO1") {
      aux_array = TPDO_1_pdo_default;
    } else if (cobid[2] == "TPDO2") {
      aux_array = TPDO_2_pdo_default;
    } else if (cobid[2] == "TPDO3") {
      aux_array = TPDO_3_pdo_default;
    } else if (cobid[2] == "TPDO4") {
      aux_array = TPDO_4_pdo_default;
    }

    PDO_detect_obj1.value = aux_array[0];
    PDO_detect_obj_subindex_1.value = aux_array[1];
    PDO_detect_obj2.value = aux_array[2];
    PDO_detect_obj_subindex_2.value = aux_array[3];
  }

  //
  if (radio_options[3].checked || radio_options[4].checked) {
    PDO_detect_obj1.value = "";
    PDO_detect_obj_subindex_1.value = "00";
    PDO_detect_obj2.value = "";
    PDO_detect_obj_subindex_2.value = "00";
    PDO_detect_obj3.value = "";
    PDO_detect_obj_subindex_3.value = "00";
    PDO_detect_obj4.value = "";
    PDO_detect_obj_subindex_4.value = "00";
    var aux_array = [];
    if (msgLen == 8) {
      aux_array = pdo_8;
    } else if (msgLen == 16) {
      aux_array = pdo_16;
    } else if (msgLen == 24) {
      aux_array = pdo_24;
    } else if (msgLen == 32) {
      aux_array = pdo_32;
    } else if (msgLen == 40) {
      aux_array = pdo_40;
    } else if (msgLen == 48) {
      aux_array = pdo_48;
    } else if (msgLen == 56) {
      aux_array = pdo_56;
    } else if (msgLen == 64) {
      aux_array = pdo_64;
    }

    if (aux_array.length == 1) {
      PDO_detect_obj1.value = aux_array[0];
    } else if (aux_array.length == 2) {
      PDO_detect_obj1.value = aux_array[0];
      PDO_detect_obj2.value = aux_array[1];
    } else if (aux_array.length == 3) {
      PDO_detect_obj1.value = aux_array[0];
      PDO_detect_obj2.value = aux_array[1];
      PDO_detect_obj3.value = aux_array[2];
    }
  }
}
//Purpose: In PDO_detected_UI we stop if the length of data dont match , or obj dont Exist
function Check4Errors_pdo_user_selection() {
  var radio_options = document.getElementsByName("PDO_detected");
  var obj_1 = ["", "", 0];
  var obj_2 = ["", "", 0];
  var obj_3 = ["", "", 0];
  var obj_4 = ["", "", 0];
  if (PDO_detect_obj1.value != "") {
    obj_1 = GetObject(
      `${PDO_detect_obj1.value}_${PDO_detect_obj_subindex_1.value}`
    );
  }
  if (PDO_detect_obj2.value != "") {
    obj_2 = GetObject(
      `${PDO_detect_obj2.value}_${PDO_detect_obj_subindex_2.value}`
    );
  }
  if (PDO_detect_obj3.value != "") {
    obj_3 = GetObject(
      `${PDO_detect_obj3.value}_${PDO_detect_obj_subindex_3.value}`
    );
  }
  if (PDO_detect_obj4.value != "") {
    obj_4 = GetObject(
      `${PDO_detect_obj4.value}_${PDO_detect_obj_subindex_4.value}`
    );
  }

  if (
    (PDO_detect_obj1.value == "" &&
      (PDO_detect_obj2.value != "" ||
        PDO_detect_obj3.value != "" ||
        PDO_detect_obj4.value != "")) ||
    (PDO_detect_obj2.value == "" &&
      (PDO_detect_obj3.value != "" || PDO_detect_obj4.value != "")) ||
    (PDO_detect_obj3.value == "" && PDO_detect_obj4.value != "")
  ) {
    ErrorModal("Please choose the mapped objects in order");
    return "Error";
  }
  if (PDO_detect_obj1.value == "") {
    ErrorModal("Object fields are empty");
    return "Error";
  }
  if (obj_1[1] == "??") {
    ErrorModal("First object is invalid");
    return "Error";
  }
  if (obj_2[1] == "??") {
    ErrorModal("Second object is invalid");
    return "Error";
  }
  if (obj_3[1] == "??") {
    ErrorModal("Third object is invalid");
    return "Error";
  }
  if (obj_4[1] == "??") {
    ErrorModal("Forth object is invalid");
    return "Error";
  }

  var sum =
    parseInt(obj_1[2]) +
    parseInt(obj_2[2]) +
    parseInt(obj_3[2]) +
    parseInt(obj_4[2]);

  var dataLen = PDO_detect_data.innerText;
  dataLen = dataLen.length * 4;

  if (sum > 64) {
    ErrorModal(`The size of the objects exceeds 64 bits
    ${obj_1[2]} + ${obj_2[2]} + ${obj_3[2]} + ${obj_4[2]} > 64 bits
    `);
    return "Error";
  }
  if (dataLen != sum) {
    if (radio_options[5].checked) {
      radio_options[5].parentNode.classList.add("none");
    } else {
      ErrorModal(`The size of the message is not equal to the object sizes
  ${obj_1[2]} + ${obj_2[2]} + ${obj_3[2]} + ${obj_4[2]} ---> ${dataLen}
  `);
      radio_options[5].parentNode.classList.remove("none");
      return "Error";
    }
  }
}

var get_rid_of_PDO_detected_g = 0;
var multiple_pdo_incoming = 0;
//Purpose: In PDO_detected_UI we gon proceed with writing in local var the mapped objects
//and the second go around someone else will do smth about it
function PDO_MAP() {
  if (multiple_pdo_incoming == 0) {
    get_rid_of_PDO_detected_g = 0;
  }
  var radio_options = document.getElementsByName("PDO_detected");
  var cobid = PDO_detect_cobID.innerText.split(" ")[0];
  cobid = CobID_who_dis(cobid);
  var axisID = cobid[1] - 1;
  var type_pdo = cobid[2].slice(0, 4) + "_" + `${cobid[2][4]}`;
  var store_array = [
    `${PDO_detect_obj1.value}_${PDO_detect_obj_subindex_1.value}`,
    `${PDO_detect_obj2.value}_${PDO_detect_obj_subindex_2.value}`,
    `${PDO_detect_obj3.value}_${PDO_detect_obj_subindex_3.value}`,
    `${PDO_detect_obj4.value}_${PDO_detect_obj_subindex_4.value}`,
  ];
  //Removing empty spaces

  for (var i = 0; i < 5; i++) {
    if (store_array[i] == "_00") {
      store_array.splice(i, 1);
      i--;
    }
  }

  if (!radio_options[2].checked) {
    window[`${type_pdo}`][axisID] = store_array;
  } else {
    for (var i = 0; i < window[`${type_pdo}`].length; i++) {
      window[`${type_pdo}`][i] = store_array;
    }
  }

  if (radio_options[4].checked) {
    get_rid_of_PDO_detected_g = 1;
  }
  PDO_detected_main_UI.classList.add("none");
  if (request_draw_onePDOmsg_g == 1) {
    DrawOneMsg();
  }
}

/*------------------------------------*/
//
//   Function    : DrawOneMsg(e)
//
//   Description : Decodes and draws one message
//
/*   IN   : Press Enter in the popup window*/
/*   OUT  : All types of messages will be decoded in a table*/
/*------------------------------------*/
var request_draw_onePDOmsg_g = 0;
function DrawOneMsg(e) {
  //disabling the option to skip all PDO user queries
  multiple_pdo_incoming = 0;
  //The message will be drawn if the user presses ENTER
  if (request_draw_onePDOmsg_g == 1 || e.key == "Enter") {
    A2_DATA_field_flyingModal.value = check_validity_hex(
      A2_DATA_field_flyingModal.value,
      64
    );
    //Formating the message into SDO format in the input field
    var aux_cobid = A2_COB_ID_field_flyingModal.value;
    var aux_cobid_same = aux_cobid;
    aux_cobid = CobID_who_dis(aux_cobid);
    var aux_msg = A2_DATA_field_flyingModal.value;

    //If COB_ID is bad - display Error
    if (aux_cobid[0] == "??") {
      ErrorModal("Please choose a valid COB_ID");
      return;
    }
    var td_count = A2_Decode_Table_body.querySelectorAll(".td_count");
    if (td_count.length == 0) {
      td_count = 1;
    } else {
      td_count = td_count[td_count.length - 1].innerHTML;
      td_count++;
    }
    //creating a row
    var tr = document.createElement("tr");
    A2_Decode_Table_body.append(tr);

    var value_array = [];

    //SDO-------------------------------
    var aux_info = DecodeOneMsg_global(aux_cobid_same, aux_msg);

    if (aux_cobid[0] == "PDO") {
      A2_DATA_field_flyingModal.value = devideStrBy2(
        A2_DATA_field_flyingModal.value
      );

      if (aux_info == undefined) {
        request_draw_onePDOmsg_g = 1;
        return;
      }
      request_draw_onePDOmsg_g = 0;
    } else if (aux_cobid[0] == "SDO") {
      var sdo_msg_length = removeSpaces(aux_msg).length;
      if (sdo_msg_length < 8) {
        ErrorModal("The SDO message is not complete");
        return;
      }

      A2_DATA_field_flyingModal.value = SDO_format(
        A2_DATA_field_flyingModal.value
      );
      aux_msg = SDO_format(aux_msg);
    } else {
      aux_msg = devideStrBy2(aux_msg);
    }
    value_array = [
      td_count,
      `<span class="td_type">${aux_cobid_same}</span> - ${aux_msg}`,
      aux_cobid[2],
      aux_cobid[1],
      aux_info[4],
      aux_info[5],
      aux_info[6],
      aux_info[7],
      aux_info[8],
      `<span class="material-symbols-sharp">close</span>`,
    ];
    //TABLE POPULATING
    for (var i = 0; i < 10; i++) {
      var td = document.createElement("td");
      td.classList.add("A2_table_td_general");
      tr.append(td);
      if (i == 0) {
        td.classList.add("td_count");
      } else if (i == 1) {
        td.classList.add("td_org_msg");
      } else if (i == 2) {
        td.classList.add("td_type");
      } else if (i == 3) {
        td.classList.add("td_AxisID");
      } else if (i == 4) {
        td.classList.add("td_cs");
      } else if (i == 5) {
        td.classList.add("td_obj");
      } else if (i == 6) {
        td.classList.add("td_objName");
      } else if (i == 7) {
        td.classList.add("td_data");
        td.addEventListener("mouseover", CreateToolTip_mouseOver_DecodeMsg);
        td.addEventListener("mouseleave", CreateToolTip_mouseLeave_DecodeMsg);
      } else if (i == 8) {
        if (aux_info[9] == 0) {
          td.classList.add("td_obj");
        } else if (aux_info[9] == 1) {
          td.classList.add("td_obj_danger");
        } else {
          td.classList.add("td_obj_actual_danger");
        }
      } else if (i == 9) {
        td.classList.add("td_close");
        td.addEventListener("click", (e) => {
          if (e.target.parentElement.parentElement.tagName == "TR") {
            e.target.parentElement.parentElement.remove();
          }
        });
      }

      td.innerHTML = `${value_array[i]}`;
      if (i == 9) {
        // var rect = td.parentElement.children[7].getBoundingClientRect().x;
      }
    }
    //ENTER was pressed
  }
  window.scrollTo(0, document.body.scrollHeight);
}
