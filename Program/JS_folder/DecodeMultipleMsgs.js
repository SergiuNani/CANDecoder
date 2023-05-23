/* ---------------- ---------------- ---------------- ---------------- ---------------- */
/* ---------------- -------- A3 Decode Multiple Messages Functions ---------  ---------------- */
/* ---------------- ---------------- ---------------- ---------------- ---------------- */

/* ----------------  ---------------- ---------------- ---------------- */
/*  Algorithm of DATA extraction from Plain Text- Decode Multiple Messages UI    */
/* ----------------  ---------------- ---------------- ---------------- */

function Extract_MSGs_from_text(text) {
  //reinitializing the main arr because it will be used multiple times
  AllMsgsExtracted_Array_g = [];
  text = text.split("\n");

  for (var aa = 0; aa < text.length; aa++) {
    //rows
    AllMsgRAW[aa] = text[aa];
    text[aa] = text[aa].split(FirstPatternEntireRowSplitter);
    text[aa] = removeSpaceElementsFromArray(text[aa]);
    text[aa] = removeNonHexElementsFromArray(text[aa]);
    var aux_cobID = Check4PotentialCobID(text[aa]);
    var aux_data;
    if (aux_cobID[0] != "x") {
      aux_data = extractDATAfromROW(text[aa], aux_cobID[1]);
    } else {
      aux_data = "x";
    }
    AllMsgsExtracted_Array_g[aa] = [aux_cobID[0], aux_data];
  }

  //In DOM we update the total number of msgs
  A3_Status_Decode_number.innerText = 0;

  A3_Status_procent.innerText = 0;
  dom(".circular-progress").style.background = `conic-gradient(
    var(--color-primary) 0deg,
    var(--color-white) 0deg
  )`;
  A3_Overview_text_msgInterval.innerText = AllMsgsExtracted_Array_g.length;
  A3_Overview_UpperLimit.value = AllMsgsExtracted_Array_g.length;

  A3_Status_Decode_all_number.innerText = AllMsgsExtracted_Array_g.length;
  var temp = A3_DecodeCANLog_UI_upload_btn.value;
  temp = temp.split(`\\`);
  A3_Status_Decode_LogPath.innerHTML = temp[temp.length - 1];
}
function Check4PotentialCobID(row) {
  //returns [cobid, index_in_the_row]
  var temp;
  var all_COBiDs = [];
  var count = 0;
  var arrayCount = [];
  for (var j = 0; j < row.length; j++) {
    if ([1, 2].includes(row[j].length)) {
      count++;
    }
    if (row[j].length > 2) {
      temp = CobID_who_dis(row[j]);
      if (temp[0] != "??") {
        all_COBiDs[all_COBiDs.length] = [row[j], j];
        arrayCount[arrayCount.length] = count;
        count = 0;
      }
    }
  }
  arrayCount[arrayCount.length] = count;
  arrayCount.splice(0, 1);

  if (all_COBiDs.length > 0) {
    var tempp = returnMaxFromArr(arrayCount);

    return [all_COBiDs[tempp[1]][0], all_COBiDs[tempp[1]][1]];
  } else {
    return ["x", "x"];
  }
  //Return [TheCobID, indexOfCobId_inTheRow]
}

function extractDATAfromROW(row, index) {
  var OneDigitPattern = /^\d$/g;
  var aux_data = "";
  for (var aa = index + 1; aa < row.length; aa++) {
    //putting the tail together
    aux_data = aux_data.concat(row[aa]);
  }
  if (OneDigitPattern.test(row[index + 1])) {
    //Conditions if lenght is specified (only as a single digit)
    aux_data = aux_data.slice(1, 18);
    if (aux_data.length > parseInt(row[index + 1]) * 2) {
      aux_data = aux_data.slice(0, parseInt(row[index + 1]) * 2);
    }
    if (aux_data == "") {
      aux_data = row[index + 1];
    }
  }
  if (aux_data.length > 16) {
    aux_data = aux_data.slice(0, 16);
  }
  if (aux_data == "") {
    aux_data = "-";
  }
  return aux_data;
}

function DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, index) {
  // pp("DecodeArrayOfMsgs_intoArray");
  //Allowing the option to skip all  PDO queries
  multiple_pdo_incoming = 1;
  for (var kk = index; kk < AllMsgsExtracted_Array_g.length; kk++) {
    var msg = AllMsgsExtracted_Array_g[kk];
    var aux_cobid_same = msg[0];
    var aux_cobid = CobID_who_dis(msg[0]);
    var aux_msg = check_validity_hex(msg[1], 64);

    //PDO DETECTED MENU
    if (aux_cobid[0] == "PDO") {
      var aux_pdo_type = aux_cobid[2].slice(0, 4) + "_" + aux_cobid[2].slice(4);
      var mapped_objects = window[`${aux_pdo_type}`][aux_cobid[1] - 1];

      if (
        PDO_detected_main_UI.classList.contains("none") &&
        mapped_objects == ""
      ) {
        DecodeOneMsg_global(aux_cobid_same, aux_msg);

        delay_DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, kk);
        return;
      } else if (mapped_objects == "") {
        index = kk;
        delay_DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, kk);
        return;
      }
    }

    AllMsgsDecoded_Array_g[kk] = DecodeOneMsg_global(aux_cobid_same, aux_msg);
    AllMsgsDecoded_Array_g[kk].splice(0, 0, kk + 1);
    //Initializing the display array with all msgs filtered
    FILTERED_ARRAY_g[kk] = AllMsgsDecoded_Array_g[kk];
    //STATISTICS CALC----------------------------------------
    var temp_axis = AllMsgsDecoded_Array_g[kk][4];
    if (temp_axis == "??" || temp_axis == undefined) {
      Unknown_Msgs_counter++;
    } else if (temp_axis == "All Axes") {
      if (AllMsgsDecoded_Array_g[kk][3] == "NMT") {
        AllAxis_Msgs_NMT++;
      } else if (AllMsgsDecoded_Array_g[kk][3] == "SYNC") {
        AllAxis_Msgs_sync++;
      } else {
        AllAxis_Msgs_TCAN++;
      }
    } else {
      if (window[`statistics_AXIS_${temp_axis}`] == undefined) {
        //If AXIS var dont exist for the specified axis then create it
        window[`statistics_AXIS_${temp_axis}`] = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        Available_Axes_perCANupload.push(temp_axis);
      }
      switch (AllMsgsDecoded_Array_g[kk][3]) {
        case "NMT":
          window[`statistics_AXIS_${temp_axis}`][0] += 1;
          break;
        case "EMCY":
          window[`statistics_AXIS_${temp_axis}`][1] += 1;
          break;
        case "RPDO1":
          window[`statistics_AXIS_${temp_axis}`][2] += 1;
          break;
        case "RPDO2":
          window[`statistics_AXIS_${temp_axis}`][3] += 1;
          break;
        case "RPDO3":
          window[`statistics_AXIS_${temp_axis}`][4] += 1;
          break;
        case "RPDO4":
          window[`statistics_AXIS_${temp_axis}`][5] += 1;
          break;
        case "TPDO1":
          window[`statistics_AXIS_${temp_axis}`][6] += 1;
          break;
        case "TPDO2":
          window[`statistics_AXIS_${temp_axis}`][7] += 1;
          break;
        case "TPDO3":
          window[`statistics_AXIS_${temp_axis}`][8] += 1;
          break;
        case "TPDO4":
          window[`statistics_AXIS_${temp_axis}`][9] += 1;
          break;
        case "T_SDO":
          window[`statistics_AXIS_${temp_axis}`][10] += 1;
          break;
        case "R_SDO":
          window[`statistics_AXIS_${temp_axis}`][11] += 1;
          break;
        case "NMT_Monitoring":
          window[`statistics_AXIS_${temp_axis}`][12] += 1;
          break;
        case "TCAN":
          window[`statistics_AXIS_${temp_axis}`][13] += 1;
          break;
      }
      if (AllMsgsDecoded_Array_g[kk][10] != 0) {
        //All errors counted
        window[`statistics_AXIS_${temp_axis}`][14] += 1;
      }
    }
    //DOM Display------------------------------------------------
    A3_Status_Decode_number.innerText = kk + 1;
    var temp = Math.floor(
      (parseInt(A3_Status_Decode_number.innerText) /
        parseInt(A3_Status_Decode_all_number.innerText)) *
        100
    );
    A3_Status_procent.innerText = temp;
    dom(".circular-progress").style.background = `conic-gradient(
      var(--color-primary) ${temp * 3.6}deg,
      var(--color-white) 0deg
    )`;
  }
  setTimeout(() => {
    //Removing the Upload/process/ status bar decoding DOM elements
    dom("body").classList.add("MsgsSavedinRAM");
  }, 600);
  OVERVIEW_UI.UPDATE();
}

function delay_DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, index) {
  setTimeout(() => {
    DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, index);
  }, 100);
}

/* ----------------  ---------------- ---------------- ---------------- */
/* TABLE- Decode Multiple Messages UI    */
/* ----------------  ---------------- ---------------- ---------------- */

class Table {
  ShortToolTip(e) {
    if (
      e.target.classList.contains("td_org_msg") &&
      e.target.querySelector(".Short_Tooltip") == null
    ) {
      const div_parent = document.createElement("div");
      div_parent.classList.add("Short_Tooltip");
      e.target.append(div_parent);

      div_parent.innerText =
        AllMsgRAW[parseInt(e.target.previousElementSibling.innerText) - 1];
      pp(div_parent.innerWidth);

      var threshold =
        e.target.offsetWidth / 2 +
        e.target.previousElementSibling.offsetWidth * 2;
      var div_parent_width = div_parent.offsetWidth / 2;
      if (div_parent_width > threshold) {
        div_parent.classList.add("Short_Tooltip_adjusted");
      }
    }
  }

  ShortToolTip_X(e) {
    if (e.target.classList.contains("td_org_msg")) {
      e.target.querySelector(".Short_Tooltip").remove();
    }
  }

  LongToolTip(e) {
    const tooltip_exists = e.target.querySelectorAll(
      ".Hover_generate_modal"
    ).length;
    if (
      tooltip_exists < 1 &&
      e.target.classList.contains("td_data") &&
      !e.target.parentElement.children[8].classList.contains("td_obj_danger")
    ) {
      if (e.target.parentElement.children[2].innerText.slice(2, 5) == "SDO") {
        var obj = e.target.parentElement.children[5].innerText;
        var value = e.target.innerText;
        var regFound = 0;
        for (var i = 0; i < All_registers_g.length; i++) {
          if (All_registers_g[i].children[0].innerHTML == obj) {
            obj = All_registers_g[i];
            i = All_registers_g.length;
            regFound = 1;
          }
        }

        if (regFound == 1) {
          var div_parent = document.createElement("div");
          div_parent.classList.add("Hover_generate_modal");
          e.target.append(div_parent);
          DrawOneTHS_Register(obj, value, div_parent);
        }
      } else if (
        e.target.parentElement.children[2].innerText.slice(1, 4) == "PDO" ||
        e.target.parentElement.children[2].innerText == "EMCY"
      ) {
        var obj = e.target.parentElement.children[5].innerText.split(" / ");
        var value = e.target.parentElement.children[7].innerText.split(" / ");

        for (var kk = 0; kk < obj.length; kk++) {
          var regFound = 0;

          for (var i = 0; i < All_registers_g.length; i++) {
            if (All_registers_g[i].children[0].innerHTML == obj[kk]) {
              obj[kk] = All_registers_g[i];
              i = All_registers_g.length;
              regFound = 1;
            }
          }
          if (regFound == 1) {
            var existingWindows = e.target.children.length;

            if (
              e.target.children[0] != undefined &&
              e.target.children[0].classList.contains("Hover_generate_modal")
            ) {
              DrawOneTHS_Register(obj[kk], value[kk], e.target.children[0]);
            } else {
              var div_parent = document.createElement("div");
              div_parent.classList.add("Hover_generate_modal");
              e.target.append(div_parent);
              DrawOneTHS_Register(obj[kk], value[kk], div_parent);
            }
          }
        }
      }
    }
    return;
  }

  LongToolTip_X(e) {
    const tooltip_exists = e.target.querySelectorAll(
      ".Hover_generate_modal"
    ).length;
    if (tooltip_exists > 0) {
      e.target.querySelector(".Hover_generate_modal").remove();
    }
  }
}
var MainTable = new Table();
//MAIN STUFF-----------------------------------

function DrawMultipleMSGs(Messages_global) {
  //remove the existing rows
  LoadCANLOG_UI.DeleteTable();
  for (var kk = 0; kk < Messages_global.length; kk++) {
    //creating a row
    var tr = document.createElement("tr");
    A2_Decode_Table_body.append(tr);
    tr.classList.add(`tr_background`);
    if (
      ["R_SDO", "NMT", "RPDO1", "RPDO2", "RPDO3", "RPDO4"].includes(
        Messages_global[kk][3]
      )
    ) {
      tr.classList.add(`tr_background_R`);
    }
    var temp_array = [...Messages_global[kk]];

    temp_array[1] = `${Messages_global[kk][1]}-${devideStrBy2(
      Messages_global[kk][2]
    )}`;
    temp_array.splice(2, 1);
    //TABLE POPULATING
    for (var i = 0; i < 10; i++) {
      var td = document.createElement("td");
      td.classList.add("A2_table_td_general");
      tr.append(td);
      if (i == 0) {
        td.classList.add("td_count");
      } else if (i == 1) {
        td.classList.add("td_org_msg");
        td.addEventListener("mouseover", MainTable.ShortToolTip);
        td.addEventListener("mouseleave", MainTable.ShortToolTip_X);
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
        td.addEventListener("mouseover", MainTable.LongToolTip);
        td.addEventListener("mouseleave", MainTable.LongToolTip_X);
      } else if (i == 8) {
        if (Messages_global[kk][10] == 0) {
          td.classList.add("td_obj");
        } else {
          td.classList.add("td_obj_danger");
        }
      } else if (i == 9) {
        td.classList.add("td_close");
        td.innerHTML = `<span class="material-symbols-sharp">close</span>`;
        td.addEventListener("click", (e) => {
          if (e.target.parentElement.parentElement.tagName == "TR") {
            e.target.parentElement.parentElement.remove();
          }
        });
      }
      if (i != 9) {
        if (temp_array[i] != undefined) {
          td.innerText = temp_array[i];
        } else {
          td.innerText = "-";
        }
      }
    }
    //ENTER was pressed
  }
}
