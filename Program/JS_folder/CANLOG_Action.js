/* ---------------- ---------------- ---------------- ---------------- ---------------- */
/* ---------------- -------- LOAD CANLOG UI ---------  ---------------- */
/* ---------------- ---------------- ---------------- ---------------- ---------------- */
class LoadCANLOG {
  InterfaceAppear() {
    dom("body").classList.toggle("A3_DecodeCANLog_UI_appeared");
  }
  InitiateDecoding() {
    //AllMsgsDecoded_Array_g is where u find all the decoded msgs
    DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, 0);
  }
  FixedUpload(file) {
    //Works only with LiveServer
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          //me from down below
          setTimeout(() => {
            Extract_MSGs_from_text(allText);
            DecodeArrayOfMsgs_intoArray(AllMsgsExtracted_Array_g, 0);
          }, 300);
        }
      }
    };
    rawFile.send(null);
  }
  UploadFile(evt) {
    var f = evt.target.files[0];
    if (f) {
      var r = new FileReader();
      r.onload = function (e) {
        Extract_MSGs_from_text(e.target.result);
        //Showie stuff
      };
      r.readAsText(f);
    } else {
      alert("Failed to load file");
    }
  }
  OpenOVERVIEW() {
    dom("body").classList.toggle("A3_Overview_appeared");
  }
  CloseOVERVIEW() {
    dom("body").classList.remove("A3_Overview_appeared");
  }

  DeleteTable() {
    var history = A2_Decode_Table_body.querySelectorAll("tr");
    for (var i = 0; i < history.length; i++) {
      history[i].remove();
    }
  }
  DiscardCANLOG() {
    //Deleting statistics history
    Unknown_Msgs_counter = 0;
    AllAxis_Msgs_NMT = 0;
    AllAxis_Msgs_sync = 0;
    AllAxis_Msgs_TCAN = 0;
    for (var i = 0; i < Available_Axes_perCANupload.length; i++) {
      delete window[`statistics_AXIS_${Available_Axes_perCANupload[i]}`];
    }
    Available_Axes_perCANupload = [];

    //OVERVIEW history
    var overview_history = A3_Axes_Availability_space.querySelectorAll(
      ".A3_Axis_overview_divParent "
    );
    for (var i = 0; i < overview_history.length; i++) {
      overview_history[i].remove();
    }
    A3_UploadCANLog_Overview_UI.querySelector(
      'input[name="A3_Option_direction"]'
    ).checked = "checked";
    A3_UploadCANLog_Overview_UI.querySelector(
      'input[name="A3_overview_MsgType"]'
    ).checked = "checked";
    A3_UploadCANLog_Overview_UI.querySelector(
      'input[name="A3_overview_displayResults"]'
    ).checked = "checked";
    A3_Overview_LowerLimit.value = "0";

    //DISPLAY history
    dom("body").classList.remove("MsgsSavedinRAM");
    dom(".circular-progress").style.background =
      "conic-gradient( var(--color-primary) 0deg, var(--color-white) 0deg )";
    dom("body").classList.remove("A3_Overview_appeared");
    A3_Status_procent.innerText = "0";
    A3_Status_Decode_number.innerText = "0";
    A3_Status_Decode_all_number.innerText = "0";
    A3_DecodeCANLog_UI_upload_btn.value = "";

    //Deleting Tables
    LoadCANLOG_UI.DeleteTable();
    //Reinitializing the display array
    FILTERED_ARRAY_g = [];
  }
}
//Main Indicator
var LoadCANLOG_UI = new LoadCANLOG();

//Making the DecodeCANLOG_UI appear
A3_DecodeCANLog_UI_btn.addEventListener("click", () => {
  LoadCANLOG_UI.InterfaceAppear();
});

//UPLOAD BTN  - upload the CANLog
A3_DecodeCANLog_UI_upload_btn.addEventListener(
  "change",
  LoadCANLOG_UI.UploadFile,
  false
);
//Process BTN - Main Decoding - everything is saved in RAM -not displayed
A3_Process_btn.addEventListener("click", LoadCANLOG_UI.InitiateDecoding);

//---------- UP Navigation Buttons --------//

//Display Results btn
A3_DisplayResults_btn.addEventListener("click", () => {});

//Open OVERVIEW_UI
A3_OVERVIEW_btn.addEventListener("click", () => {
  LoadCANLOG_UI.OpenOVERVIEW();
});

//Close OVERVIEW_UI
A3_Overview_UI_closeBtn.addEventListener("click", () => {
  LoadCANLOG_UI.CloseOVERVIEW();
});

//Delete Table btn
A3_DeleteTable_btn.addEventListener("click", () => {
  LoadCANLOG_UI.DeleteTable();
});

//Discard CANLOG btn
A3_Discard_CANLOG_btn.addEventListener("click", () => {
  LoadCANLOG_UI.DiscardCANLOG();
});

/* ---------------- ---------------- ---------------- ---------------- ---------------- */
/* ---------------- -------- OVERVIEW SETTINGS UI ---------  ---------------- */
/* ---------------- ---------------- ---------------- ---------------- ---------------- */

class OVERVIEW {
  UserPressedSmth() {
    A3_Process_Decode_btn.innerText = "Process";

    dom(".circular-progress2").style.background = `conic-gradient(
      var(--color-primary) ${0 * 3.6}deg,
      var(--color-white) 0deg
    )`;
    A3_Status_procent2.innerText = "0";
  }
  UPDATE() {
    //Rearanging the AxisArray in order
    Available_Axes_perCANupload = Available_Axes_perCANupload.sort(
      (a, b) => a - b
    );
    for (var i = 0; i < Available_Axes_perCANupload.length; i++) {
      //One parent for one axis
      let div_parent = document.createElement("div");
      A3_Axes_Availability_space.append(div_parent);
      div_parent.classList.add("A3_Axis_overview_divParent");

      let title = document.createElement("h2");
      title.innerText = `Axis ${Available_Axes_perCANupload[i]} : `;
      title.classList.add("A3_axes_label");
      title.addEventListener("click", (e) => {
        OVERVIEW_UI.UserPressedSmth();
        e.target.parentElement.classList.toggle("A3_AxisSelected");
        var allCheckboxes_oneAxis =
          e.target.nextElementSibling.querySelectorAll("input");
        for (var k = 0; k < allCheckboxes_oneAxis.length; k++) {
          if (e.target.parentElement.classList.contains("A3_AxisSelected")) {
            allCheckboxes_oneAxis[k].checked = true;
          } else {
            allCheckboxes_oneAxis[k].checked = false;
          }
        }
      });
      //Children - aka all msgs with a checkmark individually
      let msgStatistics_space = document.createElement("div");
      msgStatistics_space.classList.add("A3_axisMsg_statistic_space");
      div_parent.append(title, msgStatistics_space);
      title.parentElement.classList.add("A3_AxisSelected");
      var Axis_statistic_array =
        window[`statistics_AXIS_${Available_Axes_perCANupload[i]}`];
      for (var j = 0; j < Axis_statistic_array.length; j++) {
        if (Axis_statistic_array[j] != 0) {
          var label = document.createElement("label");
          label.classList.add("container_checkbox_3");
          label.innerText = `${Types_of_Msgs_array[j]} - ${Axis_statistic_array[j]}`;
          var input = document.createElement("input");
          input.type = "checkbox";
          input.checked = true;

          var span = document.createElement("span");
          span.classList.add("checkmark_3");
          label.append(input, span);
          msgStatistics_space.appendChild(label);
          input.addEventListener("click", (e) => {
            OVERVIEW_UI.UserPressedSmth();
            var all_checkBoxes_for_that_axis =
              e.target.parentElement.parentElement.querySelectorAll(
                ".container_checkbox_3 input"
              );
            var count = 0;
            for (var jj = 0; jj < all_checkBoxes_for_that_axis.length; jj++) {
              if (all_checkBoxes_for_that_axis[jj].checked) {
                count++;
              }
            }
            if (count == 0) {
              e.target.parentElement.parentElement.parentElement.classList.remove(
                "A3_AxisSelected"
              );
            } else {
              e.target.parentElement.parentElement.parentElement.classList.add(
                "A3_AxisSelected"
              );
            }
          });
        }
      }
    }
    //Separate parent containing all the global messages
    var array_temp = [
      Unknown_Msgs_counter,
      AllAxis_Msgs_NMT,
      AllAxis_Msgs_sync,
      AllAxis_Msgs_TCAN,
    ];
    if (
      Unknown_Msgs_counter ||
      AllAxis_Msgs_NMT ||
      AllAxis_Msgs_sync ||
      AllAxis_Msgs_TCAN
    ) {
      let div_parent = document.createElement("div");
      A3_Axes_Availability_space.append(div_parent);
      div_parent.classList.add("A3_Axis_overview_divParent");

      let title = document.createElement("h2");
      title.innerText = `All Axes : `;
      title.classList.add("A3_axes_label");
      title.addEventListener("click", (e) => {
        OVERVIEW_UI.UserPressedSmth();
        e.target.parentElement.classList.toggle("A3_AxisSelected");
        var allCheckboxes_oneAxis =
          e.target.nextElementSibling.querySelectorAll("input");
        for (var k = 0; k < allCheckboxes_oneAxis.length; k++) {
          if (e.target.parentElement.classList.contains("A3_AxisSelected")) {
            allCheckboxes_oneAxis[k].checked = true;
          } else {
            allCheckboxes_oneAxis[k].checked = false;
          }
        }
      });

      let msgStatistics_space = document.createElement("div");
      msgStatistics_space.classList.add("A3_axisMsg_statistic_space");
      div_parent.append(title, msgStatistics_space);
      title.parentElement.classList.add("A3_AxisSelected");

      for (var j = 0; j < array_temp.length; j++) {
        if (array_temp[j] != 0) {
          var label = document.createElement("label");
          label.classList.add("container_checkbox_3");
          var temp = "";
          if (j == 0) {
            temp = "???";
          } else if (j == 1) {
            temp = "NMT";
          } else if (j == 2) {
            temp = "SYNC";
          } else {
            temp = "TCAN";
          }
          label.innerText = `${temp} - ${array_temp[j]}`;
          var input = document.createElement("input");
          input.type = "checkbox";
          input.checked = true;

          var span = document.createElement("span");
          span.classList.add("checkmark_3");
          label.append(input, span);
          msgStatistics_space.appendChild(label);
          input.addEventListener("click", (e) => {
            OVERVIEW_UI.UserPressedSmth();
            var all_checkBoxes_for_that_axis =
              e.target.parentElement.parentElement.querySelectorAll(
                ".container_checkbox_3 input"
              );
            var count = 0;
            for (var jj = 0; jj < all_checkBoxes_for_that_axis.length; jj++) {
              if (all_checkBoxes_for_that_axis[jj].checked) {
                count++;
              }
            }
            if (count == 0) {
              e.target.parentElement.parentElement.parentElement.classList.remove(
                "A3_AxisSelected"
              );
            } else {
              e.target.parentElement.parentElement.parentElement.classList.add(
                "A3_AxisSelected"
              );
            }
          });
        }
      }
    }
  }

  FilteringAlgorithm(e) {
    if (e.target.innerText == "Process") {
      //A. Deleting history
      VirtArrays4AxisTypes.forEach((arr) => {
        delete window[`${arr}`];
      });
      Keywords_nrAxisID_array = [];
      VirtArrays4AxisTypes = [];
      //remove the existing rows
      LoadCANLOG_UI.DeleteTable();
      FILTERED_ARRAY_g = [];

      //B. Preparing filtration arrays
      var Axis_space = A3_Axes_Availability_space.querySelectorAll(
        ".A3_AxisSelected .A3_axes_label"
      );
      Axis_space.forEach((el, i) => {
        var temp = el.innerText.split(" "); //temp[1]=AxisID from OVERVIEW

        //Creating an array which includes all types
        var temp_types = el.parentElement.querySelectorAll(
          'input[type="checkbox"]:checked'
        );
        var temp_arr = [];
        temp_types.forEach((type, ii) => {
          temp_arr[ii] = type.parentElement.innerText.split(" ")[0];
        });
        window[`Display_types_${temp[1]}`] = temp_arr;
        //Creating an array which includes arrays with types -used for deleting virt arr
        VirtArrays4AxisTypes[i] = `Display_types_${temp[1]}`;

        Keywords_nrAxisID_array[i] = temp[1];
      });

      var iter = 0;
      var ReadingUpsideDown =
        A3_overview_LOG_direction_options.querySelectorAll("input")[1].checked;
      var lowerLimit = parseInt(A3_Overview_LowerLimit.value) - 1;
      var upperLimit = parseInt(A3_Overview_UpperLimit.value);

      //C. MAIN LOOP
      var j = 0;
      for (var i = lowerLimit; i < upperLimit; i++) {
        if (ReadingUpsideDown) {
          //Reading direction - Bottom - UP
          iter = upperLimit - i - 1;
        } else {
          //UP-Button
          iter = i;
        }
        var oneMsg = [...AllMsgsDecoded_Array_g[iter]];
        var keyword_AxisId;
        if (oneMsg[4] == undefined || oneMsg[4] == "-") {
          //Messages like [x x] will be considered as msgs for all axes -temporary modification - will be erased later
          keyword_AxisId = "Axes";
        } else {
          keyword_AxisId = oneMsg[4].toString();
        }
        //Adjusting
        if (keyword_AxisId == "All Axes") {
          keyword_AxisId = "Axes";
        }

        //Filter by AXIS_ID--------------------------------------------
        if (Keywords_nrAxisID_array.includes(keyword_AxisId)) {
          var keyword_Type = oneMsg[3];
          //Adjusting the search word based on the OVERVIEW text
          if (keyword_Type == "R_SDO") {
            keyword_Type = "RSDO";
          } else if (keyword_Type == "-" || keyword_Type == undefined) {
            keyword_Type = "???";
          } else if (keyword_Type == "T_SDO") {
            keyword_Type = "TSDO";
          } else if (keyword_Type == "NMT_Monitoring") {
            keyword_Type = "NMT_M";
          }

          //Accounting for Errors type msg
          var letErrorMsgsIn = 0;
          if (
            window[`Display_types_${keyword_AxisId}`].includes("Errors") &&
            oneMsg[10] == 1
          ) {
            letErrorMsgsIn = 1;
          }

          //Filter by MSG TYPE----------------------------------------------
          if (
            window[`Display_types_${keyword_AxisId}`].includes(keyword_Type) ||
            letErrorMsgsIn
          ) {
            if (A3_Mapping_msgs_type_option_input.checked) {
              //Filter by Mapping objects--------------------------
              if (Mapping_objects_filter_array_g.includes(oneMsg[6])) {
                FILTERED_ARRAY_g[j] = oneMsg;
                j++;
              }
            } else {
              FILTERED_ARRAY_g[j] = oneMsg;
              j++;
            }
          }
        }

        //STATISTICS DOM DISPLAY-------------------
        var temp = Math.floor(
          (parseInt(i + 1) / parseInt(A3_Overview_UpperLimit.value)) * 100
        );
        A3_Status_procent2.innerText = temp;
        dom(".circular-progress2").style.background = `conic-gradient(
          var(--color-primary) ${temp * 3.6}deg,
          var(--color-white) 0deg
        )`;
        //END MAIN LOOP
      }
      e.target.innerText = "DECODE";
    } else {
      //DECODE
      DrawMultipleMSGs(FILTERED_ARRAY_g);
      window.scrollTo(0, 0);
    }

    //A3_overview_LOG_direction_options
  }
}
var OVERVIEW_UI = new OVERVIEW();

//CAN log direction
A3_overview_LOG_direction_options.addEventListener("change", () => {
  OVERVIEW_UI.UserPressedSmth();
});
//Limit by Lower index
A3_Overview_LowerLimit.addEventListener("input", () => {
  OVERVIEW_UI.UserPressedSmth();
  A3_Overview_LowerLimit.value = check_validity_decimal(
    A3_Overview_LowerLimit.value,
    16
  );

  var upperLimit = parseInt(A3_Overview_UpperLimit.value);
  var lowerLimit = parseInt(A3_Overview_LowerLimit.value);
  if (isNaN(lowerLimit) || lowerLimit < 1) {
    A3_Overview_LowerLimit.value = 1;
  } else if (lowerLimit >= upperLimit) {
    A3_Overview_LowerLimit.value = upperLimit - 1;
  }
});
//Limit by Upper index
A3_Overview_UpperLimit.addEventListener("change", () => {
  var upperLimit = parseInt(A3_Overview_UpperLimit.value);
  var lowerLimit = parseInt(A3_Overview_LowerLimit.value);
  var max = A3_Status_Decode_all_number.innerText;

  if (isNaN(upperLimit) || upperLimit == 0 || lowerLimit >= upperLimit) {
    A3_Overview_UpperLimit.value = max;
  }
});
A3_Overview_UpperLimit.addEventListener("input", () => {
  OVERVIEW_UI.UserPressedSmth();
  A3_Overview_UpperLimit.value = check_validity_decimal(
    A3_Overview_UpperLimit.value,
    16
  );
  var upperLimit = parseInt(A3_Overview_UpperLimit.value);
  var max = A3_Status_Decode_all_number.innerText;

  if (upperLimit > max || upperLimit < 0) {
    A3_Overview_UpperLimit.value = max;
  }
});
//Special Selection All - Master - Mapping - Error
A3_MessageTypes_overview_options.addEventListener("change", (e) => {
  OVERVIEW_UI.UserPressedSmth();
  var all_parentElements_Axis_space =
    A3_Axes_Availability_space.querySelectorAll(".A3_AxisSelected");
  var filteringArray = [];
  var Ignore = 0;
  if (e.target.parentElement.innerText == "Master ") {
    filteringArray = ["RPDO", "NMT ", "RSDO"];
  } else if (e.target.parentElement.innerText == "All ") {
    Ignore = 1;
  } else if (e.target.parentElement.innerText == "Mapping ") {
    filteringArray = ["RSDO"];
  } else {
    filteringArray = ["Erro"];
    //Errors:
  }

  for (var i = 0; i < all_parentElements_Axis_space.length; i++) {
    var Checkmarks_all = all_parentElements_Axis_space[i].querySelectorAll(
      ".container_checkbox_3"
    );
    for (var j = 0; j < Checkmarks_all.length; j++) {
      text = Checkmarks_all[j].innerText.slice(0, 4);
      if (filteringArray.includes(text)) {
        Checkmarks_all[j].querySelector("input").checked = true;
      } else if (!Ignore) {
        Checkmarks_all[j].querySelector("input").checked = false;
      }
    }
    //If all the checkmarks have been unchecked - remove the AxisSelected option
    var allCheckedOptions = all_parentElements_Axis_space[i].querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    if (allCheckedOptions.length == 0) {
      all_parentElements_Axis_space[i].classList.remove("A3_AxisSelected");
    }
  }
});

//CAN-LOG Display Options
A3_overview_displayResults_UI.addEventListener("change", () => {
  OVERVIEW_UI.UserPressedSmth();
});

//FILTERING ALGORITHM
A3_Process_Decode_btn.addEventListener("click", OVERVIEW_UI.FilteringAlgorithm);

/* ----------------  ---------------- ---------------- ---------------- */
/* ---------------- IDK ---------------- */
/* ----------------  ---------------- ---------------- ---------------- */

//-------------------------------------------------------
//-----------------For debugging -- DELETE
//-------------------------------------------------------
LoadCANLOG_UI.FixedUpload("./demo5.txt");
