/* ---------------- ---------------- ---------------- ---------------- ---------------- */
/* ---------------- ---------- Compose CAN messages UI -----------  ---------------- */
/* ---------------- ---------------- ---------------- ---------------- ---------------- */
//Main Sidebar btn:
A1_ComposeCANmsgs_UI_btn.addEventListener("click", () => {
  dom("body").classList.toggle("A1_ComposeCANmsgs_UI_appeared");
});

A1_ComposeCANmsgs_UI_close_btn.addEventListener("click", () => {
  dom("body").classList.toggle("A1_ComposeCANmsgs_UI_appeared");
});
//UI Options:
Expand_writeMSG_menu_CM.addEventListener("click", () => {
  A1_ComposeCANmsgs_UI.classList.toggle("Expand_writeMSG_menu_CM");
});
Expand_A1_Table_CM.addEventListener("click", () => {
  A1_ComposeCANmsgs_UI.classList.toggle("Expand_A1_Table_CM");
});
//Main BTN to Drow msg in a Table
composeCANmsg_btn.addEventListener("click", DrawCodedMessage);

//Protection AXIS ID
Compose_msgAxisID.addEventListener("input", () => {
  Compose_msgAxisID.value = check_validity_decimal(Compose_msgAxisID.value, 16);
});

/* ----------------  ---------------- ---------------- ---------------- */
/* ---------------- EVENTS - User Settings UI   ---------------- */
/* ----------------  ---------------- ---------------- ---------------- */

/**Adding Event Listeners to DROPDOWN lists*/
//Event listener only to unmodifying lists

var all_dropdowns = document.querySelectorAll(".dropdown_g");
all_dropdowns.forEach((menu) => {
  menu.querySelector("input").addEventListener("click", () => {
    //Removing all the dropdowns
    var all_opened_dropdowns = document.querySelectorAll(".dropdown_g.active");
    all_opened_dropdowns.forEach((list) => {
      if (list.children[0].id != menu.children[0].id)
        list.classList.remove("active");
    });

    menu.classList.toggle("active");
  });

  var all_options = menu.querySelectorAll(".dropdown_options p");
  all_options.forEach((option) => {
    option.addEventListener("click", (e) => {
      menu.querySelector("input").value = e.target.innerText;
      menu.classList.toggle("active");
      Update_units_g();
      //For NMT command leave only the value w/o the description
      if (menu.querySelector("input").id == "NMT_options") {
        NMT_options.value = NMT_options.value.slice(0, 4);
      }
      //------ Type of Message input field SDO/PDO
      if (
        e.target.parentElement.previousElementSibling.id == "Compose_msgType"
      ) {
        A1_ComposeCANmsgs_UI.classList.remove("Compose_SDO");
        A1_ComposeCANmsgs_UI.classList.remove("Compose_PDO");
        A1_ComposeCANmsgs_UI.classList.remove("Compose_NMT");
        if (Compose_msgType.value == "SDO") {
          A1_ComposeCANmsgs_UI.classList.add("Compose_SDO");
        } else if (Compose_msgType.value == "PDO") {
          A1_ComposeCANmsgs_UI.classList.add("Compose_PDO");
        } else if (Compose_msgType.value == "NMT") {
          A1_ComposeCANmsgs_UI.classList.add("Compose_NMT");
        }
      }
    });
  });
});

/* ---------------- SDO - Compose MSG CAN - fields  ---------------- */

Read_write_option_CM.addEventListener("change", () => {
  A1_ComposeCANmsgs_UI.classList.toggle("Read_SDO_CM");
});

SDO_obj_input_CM.addEventListener("input", () => {
  SDO_input_value_CM.value = "";
  SDO_subindex_value_CM.value = "00";
  SDO_helping_FG.value = "IU";

  SDO_obj_input_CM.value = check_validity_hex(SDO_obj_input_CM.value, 16);
  Update_units_g();
});
SDO_input_value_CM.addEventListener("input", () => {
  var aux_objectDetails;
  var aux_obj = SDO_obj_input_CM.value;
  var aux_subindex = SDO_subindex_value_CM.value;

  if (aux_subindex == "00") {
    aux_objectDetails = GetObject(aux_obj);
  } else {
    aux_objectDetails = GetObject(`${aux_obj}${aux_subindex}`);
  }
  if (aux_objectDetails[1] == "??") {
    ErrorModal("Please select a valid Object");
    return;
  }

  if (A1_ComposeCANmsgs_UI.classList.contains("SDO_no_FG")) {
    if (aux_objectDetails[2] == "32") {
      SDO_input_value_CM.value = check_validity_hex(
        SDO_input_value_CM.value,
        32
      );
    } else if (aux_objectDetails[2] == "16") {
      SDO_input_value_CM.value = check_validity_hex(
        SDO_input_value_CM.value,
        16
      );
    }
    if (aux_objectDetails[2] == "8") {
      SDO_input_value_CM.value = check_validity_hex(
        SDO_input_value_CM.value,
        8
      );
    }
  } else {
    SDO_input_value_CM.value = checkVal_dec_comma(SDO_input_value_CM.value, 16);
  }
});

/* ---------------- PDO - Compose MSG CAN - fields  ---------------- */

//Refreshing all the TPDOs objects and subindexes
var typePDO_CM_g = 1;
checkboxes_PDO_type.addEventListener("change", (e) => {
  PDO_input_value_CM_1.value = "";
  PDO_input_value_CM_2.value = "";
  PDO_input_value_CM_3.value = "";
  PDO_input_value_CM_4.value = "";

  var array = [];
  if (e.target.parentElement.innerText == "RPDO_1") {
    array = RPDO_1_CM;
    typePDO_CM_g = 1;
  } else if (e.target.parentElement.innerText == "RPDO_2") {
    array = RPDO_2_CM;
    typePDO_CM_g = 2;
  } else if (e.target.parentElement.innerText == "RPDO_3") {
    array = RPDO_3_CM;
    typePDO_CM_g = 3;
  } else if (e.target.parentElement.innerText == "RPDO_4") {
    array = RPDO_4_CM;
    typePDO_CM_g = 4;
  }
  pdo_obj_value_1.value = array[0];
  PDO_subindex_input_1.value = array[1];
  pdo_obj_value_2.value = array[2];
  PDO_subindex_input_2.value = array[3];
  pdo_obj_value_3.value = array[4];
  PDO_subindex_input_3.value = array[5];
  pdo_obj_value_4.value = array[6];
  PDO_subindex_input_4.value = array[7];

  Update_units_g();
  PDO_helping_FG_1.value = "IU";
  PDO_helping_FG_2.value = "IU";
  PDO_helping_FG_3.value = "IU";
  PDO_helping_FG_4.value = "IU";
});

//We will save all the users work
checkboxes_PDO_type.addEventListener("click", (e) => {
  //On click this event is called twice
  if (!e.target.classList.contains("container_checkbox")) {
    return;
  }
  if (checkboxes_PDO_type.children[0].querySelector("input").checked) {
    RPDO_1_CM = [
      pdo_obj_value_1.value,
      PDO_subindex_input_1.value,
      pdo_obj_value_2.value,
      PDO_subindex_input_2.value,
      pdo_obj_value_3.value,
      PDO_subindex_input_3.value,
      pdo_obj_value_4.value,
      PDO_subindex_input_4.value,
    ];
  } else if (checkboxes_PDO_type.children[1].querySelector("input").checked) {
    RPDO_2_CM = [
      pdo_obj_value_1.value,
      PDO_subindex_input_1.value,
      pdo_obj_value_2.value,
      PDO_subindex_input_2.value,
      pdo_obj_value_3.value,
      PDO_subindex_input_3.value,
      pdo_obj_value_4.value,
      PDO_subindex_input_4.value,
    ];
  } else if (checkboxes_PDO_type.children[2].querySelector("input").checked) {
    RPDO_3_CM = [
      pdo_obj_value_1.value,
      PDO_subindex_input_1.value,
      pdo_obj_value_2.value,
      PDO_subindex_input_2.value,
      pdo_obj_value_3.value,
      PDO_subindex_input_3.value,
      pdo_obj_value_4.value,
      PDO_subindex_input_4.value,
    ];
  } else if (checkboxes_PDO_type.children[3].querySelector("input").checked) {
    RPDO_4_CM = [
      pdo_obj_value_1.value,
      PDO_subindex_input_1.value,
      pdo_obj_value_2.value,
      PDO_subindex_input_2.value,
      pdo_obj_value_3.value,
      PDO_subindex_input_3.value,
      pdo_obj_value_4.value,
      PDO_subindex_input_4.value,
    ];
  }
});

//First PDO line
pdo_obj_value_1.addEventListener("input", (e) => {
  PDO_input_value_CM_1.value = "";
  PDO_subindex_input_1.value = "00";
  PDO_helping_FG_1.value = "IU";
  pdo_obj_value_1.value = check_validity_hex(pdo_obj_value_1.value, 16);
  Update_units_g();
});
PDO_input_value_CM_1.addEventListener("input", () => {
  PDO_input_eventListener(1);
});
//Second PDO line
pdo_obj_value_2.addEventListener("input", (e) => {
  PDO_input_value_CM_2.value = "";
  PDO_subindex_input_2.value = "00";
  PDO_helping_FG_2.value = "IU";
  pdo_obj_value_2.value = check_validity_hex(pdo_obj_value_2.value, 16);
  Update_units_g();
});
PDO_input_value_CM_2.addEventListener("input", () => {
  PDO_input_eventListener(2);
});
//Third PDO line
pdo_obj_value_3.addEventListener("input", (e) => {
  PDO_input_value_CM_3.value = "";
  PDO_subindex_input_3.value = "00";
  PDO_helping_FG_3.value = "IU";
  pdo_obj_value_3.value = check_validity_hex(pdo_obj_value_3.value, 16);
  Update_units_g();
});
PDO_input_value_CM_3.addEventListener("input", () => {
  PDO_input_eventListener(3);
});
//Forth PDO line
pdo_obj_value_4.addEventListener("input", () => {
  PDO_input_value_CM_4.value = "";
  PDO_subindex_input_4.value = "00";
  PDO_helping_FG_4.value = "IU";
  pdo_obj_value_4.value = check_validity_hex(pdo_obj_value_4.value, 16);
  Update_units_g();
});

PDO_input_value_CM_4.addEventListener("input", () => {
  PDO_input_eventListener(4);
});

//NMT Section
NMT_broadcastMSG.addEventListener("change", () => {
  A1_ComposeCANmsgs_UI.classList.toggle("NMT_broadcastMSG");
});
//Event Listener for PDO value fields - limits the value based on the object size
function PDO_input_eventListener(id) {
  var aux_objectDetails;
  var aux_obj = window[`pdo_obj_value_${id}`].value;
  var aux_subindex = window[`PDO_subindex_input_${id}`].value;
  if (aux_subindex == "00") {
    aux_objectDetails = GetObject(aux_obj);
  } else {
    aux_objectDetails = GetObject(`${aux_obj}${aux_subindex}`);
  }
  if (aux_objectDetails[1] == "??") {
    ErrorModal(`Please select a valid ${id} object`);
    window[`PDO_input_value_CM_${id}`].value = "";
    return;
  }

  if (A1_ComposeCANmsgs_UI.classList.contains(`PDO_no_FG_${id}`)) {
    if (aux_objectDetails[2] == "32") {
      window[`PDO_input_value_CM_${id}`].value = check_validity_hex(
        window[`PDO_input_value_CM_${id}`].value,
        32
      );
    } else if (aux_objectDetails[2] == "16") {
      window[`PDO_input_value_CM_${id}`].value = check_validity_hex(
        window[`PDO_input_value_CM_${id}`].value,
        16
      );
    }
    if (aux_objectDetails[2] == "8") {
      window[`PDO_input_value_CM_${id}`].value = check_validity_hex(
        window[`PDO_input_value_CM_${id}`].value,
        8
      );
    }
  } else {
    window[`PDO_input_value_CM_${id}`].value = checkVal_dec_comma(
      window[`PDO_input_value_CM_${id}`].value,
      16
    );
  }
}

//Making possible for input objects search +dropdown to exist

CreateObj_dropdownMenu(dropdown_SDO_Obj);
CreateObj_dropdownMenu(dropdown_PDO_Obj1);
CreateObj_dropdownMenu(dropdown_PDO_Obj2);
CreateObj_dropdownMenu(dropdown_PDO_Obj3);
CreateObj_dropdownMenu(dropdown_PDO_Obj4);

CreateObj_dropdownMenu(dropdown_SDO_subindex);
CreateObj_dropdownMenu(dropdown_PDO_Obj1_subindex);
CreateObj_dropdownMenu(dropdown_PDO_Obj2_subindex);
CreateObj_dropdownMenu(dropdown_PDO_Obj3_subindex);
CreateObj_dropdownMenu(dropdown_PDO_Obj4_subindex);

/* ----------------  ---------------- ---------------- ---------------- */
/* ---------------- Algorithm - User Settings UI   ---------------- */
/* ----------------  ---------------- ---------------- ---------------- */
//For special inputs it creates a dropdpown list of all the objects +seach possibility
function CreateObj_dropdownMenu(space) {
  space
    .querySelector("input")
    .addEventListener("keyup", CreateObj_dropdownMenu2);
  space
    .querySelector("input")
    .addEventListener("focus", CreateObj_dropdownMenu2);
  space
    .querySelector("input")
    .addEventListener("blur", CreateObj_dropdownMenu3);
}
//Creates the physical dropdown options with all the XML objects for special inputs
function CreateObj_dropdownMenu2(e) {
  if (e.target.parentElement.querySelector(".dropdown_options") != null) {
    e.target.parentElement.querySelector(".dropdown_options").remove();
  }
  const dropdown_options = document.createElement("div");
  e.target.parentElement.appendChild(dropdown_options);
  dropdown_options.setAttribute("class", "dropdown_options");
  //Creating  subindex dropdown
  if (e.target.parentElement.classList.contains("subindex")) {
    if (e.target.parentElement.previousElementSibling.children[0].value == "") {
      return;
    }
    for (var j = 0; j < All_Objects_g.length; j++) {
      if (
        All_Objects_g[j].children[0].innerHTML
          .toUpperCase()
          .indexOf(
            e.target.parentElement.previousElementSibling.children[0].value.toUpperCase()
          ) > -1
      ) {
        var all_subindex = All_Objects_g[j].querySelectorAll("SubItem");
        all_subindex.forEach((subindex) => {
          var option_p = document.createElement("p");
          dropdown_options.appendChild(option_p);
          option_p.innerText = `${subindex
            .querySelector("Index")
            .innerHTML.slice(2, 9)} - ${
            subindex.querySelector("Name").innerHTML
          } `;
          option_p.addEventListener("click", (e) => {
            e.target.parentElement.previousElementSibling.value =
              e.target.innerText.slice(5, 7);
            e.target.parentElement.parentElement.classList.toggle("active");
            Update_units_g();
          });
        });
      }
    }
  } else {
    //Creating  object dropdown

    for (var j = 0; j < All_Objects_g.length; j++) {
      if (
        All_Objects_g[j].children[0].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1 ||
        All_Objects_g[j].children[1].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1
      ) {
        var option_p = document.createElement("p");
        dropdown_options.appendChild(option_p);
        option_p.innerText = `${All_Objects_g[j].children[0].innerHTML.slice(
          2,
          6
        )} - ${All_Objects_g[j].children[1].innerHTML} `;
        option_p.addEventListener("click", (e) => {
          e.target.parentElement.previousElementSibling.value =
            e.target.innerText.slice(0, 4);
          e.target.parentElement.parentElement.classList.toggle("active");
        });
      }
    }
  }

  if (e.type == "focus") {
    if (dropdown_options.children.length == 1) {
      dropdown_options.remove();

      Input_field_Success(e.target.parentElement);
    }
  }
}
//(BLUR)When clicking on an option from the dropdown menu then we will update all the FG/nonFG objects units
function CreateObj_dropdownMenu3(e) {
  Update_units_g();
  if (e.target.id == `SDO_subindex_value_CM`) {
    SDO_input_value_CM.value = "";
  } else if (e.target.id == `PDO_subindex_input_1`) {
    PDO_input_value_CM_1.value = "";
  } else if (e.target.id == `PDO_subindex_input_2`) {
    PDO_input_value_CM_2.value = "";
  } else if (e.target.id == `PDO_subindex_input_3`) {
    PDO_input_value_CM_3.value = "";
  } else if (e.target.id == `PDO_subindex_input_4`) {
    PDO_input_value_CM_4.value = "";
  }
}

function DrawCodedMessage() {
  //Protection - message type unselected
  if (Compose_msgType.value == "") {
    ErrorModal("Select the message type");
    return;
  }

  //Protection - Axis ID bad value
  var aux_axisID = Compose_msgAxisID.value;
  aux_axisID = parseInt(aux_axisID);
  if (aux_axisID > 127 || aux_axisID <= 0 || isNaN(aux_axisID)) {
    ErrorModal("Axis ID must be included between 1 - 127");
    return;
  }

  //Protection - OneRot or one meter in IU not specified
  if (OneRot_IU_value.value == "") {
    dom("body").classList.add("open_UserSettings_UI");

    dom("body").classList.add("Expand_Load_type_menu_CM");

    window.scrollTo(0, 0);
    Input_field_Error(OneRot_IU_value.parentElement);
    return;
  }

  var value_array = [];
  var aux_type = Compose_msgType.value;

  //Counting how many messages there are
  var td_count = A1_Table_CM_body.querySelectorAll(".td_count_CM");
  if (td_count.length == 0) {
    td_count = 1;
  } else {
    td_count = td_count[td_count.length - 1].innerHTML;
    td_count++;
  }

  //SDO--------------------------------------------------------
  if (aux_type == "SDO") {
    //Protection - bad object
    var aux_obj = SDO_obj_input_CM.value;
    var aux_subindex = SDO_subindex_value_CM.value;
    var aux_objectDetails;
    if (aux_subindex == "00") {
      aux_objectDetails = GetObject(aux_obj);
    } else {
      aux_objectDetails = GetObject(`${aux_obj}${aux_subindex}`);
    }
    if (aux_objectDetails[1] == "??") {
      ErrorModal("Please select a valid Object");
      return;
    }
    var aux = CodeSDO();

    value_array = [
      td_count,
      aux[0],
      aux[1],
      aux[2],
      `<span class="material-symbols-sharp">close</span>`,
    ];
  }

  //PDO--------------------------------------------------------

  if (aux_type == "PDO") {
    var aux = CodePDO();
    if (aux == "Error") {
      return;
    }

    value_array = [
      td_count,
      aux[0],
      aux[1],
      aux[2],
      `<span class="material-symbols-sharp">close</span>`,
    ];
  }

  if (aux_type == "NMT") {
    if (NMT_options.value == "") {
      ErrorModal("Please select a NMT command");
      return;
    }
    var aux = CodeNMT();
    value_array = [
      td_count,
      aux[0],
      aux[1],
      aux[2],
      `<span class="material-symbols-sharp">close</span>`,
    ];
  }

  //TABLE POPULATING - Coded Messages
  window.scrollTo(0, document.body.scrollHeight);
  //creating a row element
  const tr = document.createElement("tr");
  A1_Table_CM_body.appendChild(tr);
  for (var i = 0; i < 5; i++) {
    var td = document.createElement("td");
    td.classList.add("A2_table_td_general");
    tr.append(td);
    if (i == 0) {
      td.classList.add("td_count_CM");
    } else if (i == 1) {
      td.classList.add("primary");
      // td.style.color = "var(--color-primary)";
    } else if (i == 4) {
      td.addEventListener("click", (e) => {
        if (e.target.parentElement.parentElement.tagName == "TR") {
          e.target.parentElement.parentElement.remove();
        }
      });
    }

    td.innerHTML = `${value_array[i]}`;
  }
}

//Function that updates all the units currently in the Compose MSG UI
function Update_units_g(e) {
  //=============== SDOs =================//

  var aux_FG_type = FG_object(
    `${SDO_obj_input_CM.value}_${SDO_subindex_value_CM.value}`
  );

  //Create a text indication of the FG type applied
  SDO_helping_FG.parentElement.parentElement.querySelector("p").remove();
  var units_title = document.createElement("p");
  units_title.classList.add("text-muted");
  SDO_helping_FG.parentElement.parentElement.insertBefore(
    units_title,
    SDO_helping_FG.parentElement
  );
  //Change the title only for SDO menu, beucase the PDOs take to much height

  var aux_array_options = [];
  if (aux_FG_type == "nothing") {
    A1_ComposeCANmsgs_UI.classList.add("SDO_no_FG");
  } else {
    A1_ComposeCANmsgs_UI.classList.remove("SDO_no_FG");

    if (aux_FG_type == "pos") {
      if (dom("body").classList.contains("FactorGroupEnabled")) {
        //FG enabled
        if (dom("body").classList.contains("Rotary_class")) {
          FG_units_SDO_value.innerText = FG_pos_rot.value;
        } else {
          FG_units_SDO_value.innerText = FG_pos_lin.value;
        }
      } else {
        if (dom("body").classList.contains("Rotary_class")) {
          aux_array_options = FG_pos_rot_units;
        } else {
          aux_array_options = FG_pos_lin_units;
        }
        units_title.innerText = "Position Units";
      }
    } else if (aux_FG_type == "spd") {
      if (dom("body").classList.contains("FactorGroupEnabled")) {
        if (dom("body").classList.contains("Rotary_class")) {
          FG_units_SDO_value.innerText = FG_spd_rot.value;
        } else {
          FG_units_SDO_value.innerText = FG_spd_lin.value;
        }
      } else {
        if (dom("body").classList.contains("Rotary_class")) {
          aux_array_options = FG_spd_rot_units;
        } else {
          aux_array_options = FG_spd_lin_units;
        }
        units_title.innerText = "Velocity Units";
      }
    } else if (aux_FG_type == "acc") {
      if (dom("body").classList.contains("FactorGroupEnabled")) {
        if (dom("body").classList.contains("Rotary_class")) {
          FG_units_SDO_value.innerText = FG_acc_rot.value;
        } else {
          FG_units_SDO_value.innerText = FG_acc_lin.value;
        }
      } else {
        if (dom("body").classList.contains("Rotary_class")) {
          aux_array_options = FG_acc_rot_units;
        } else {
          aux_array_options = FG_acc_lin_units;
        }
        units_title.innerText = "Acceleration Units";
      }
    } else if (aux_FG_type == "time") {
      if (dom("body").classList.contains("FactorGroupEnabled")) {
        FG_units_SDO_value.innerText = FG_time_units.value;
      } else {
        //Do not care if Rotary or linear
        aux_array_options = FG_time_possible_units;
        units_title.innerText = "Time Units";
      }
    }
    if (!dom("body").classList.contains("FactorGroupEnabled")) {
      //Removing the previous dropdown options
      if (
        SDO_helping_FG.parentElement.querySelector(".dropdown_options") != null
      ) {
        SDO_helping_FG.parentElement
          .querySelector(".dropdown_options")
          .remove();
      }

      const dropdown_options = document.createElement("div");
      SDO_helping_FG.parentElement.appendChild(dropdown_options);
      dropdown_options.setAttribute("class", "dropdown_options");

      //Creating  FG dropdown
      aux_array_options.forEach((option_text) => {
        var option_p = document.createElement("p");
        dropdown_options.appendChild(option_p);
        option_p.innerText = option_text;
        option_p.addEventListener("click", (ee) => {
          ee.target.parentElement.previousElementSibling.value = option_text;
          ee.target.parentElement.parentElement.classList.toggle("active");
        });
      });
    }
  }
  //=============== PDOs =================//

  for (var i = 1; i < 5; i++) {
    var aux_FG_type = FG_object(
      `${window[`pdo_obj_value_${i}`].value}_${
        window[`PDO_subindex_input_${i}`].value
      }`
    );
    var aux_array_options;
    if (aux_FG_type == "nothing") {
      A1_ComposeCANmsgs_UI.classList.add(`PDO_no_FG_${i}`);
    } else {
      A1_ComposeCANmsgs_UI.classList.remove(`PDO_no_FG_${i}`);

      if (aux_FG_type == "pos") {
        if (dom("body").classList.contains("FactorGroupEnabled")) {
          //FG enabled
          if (dom("body").classList.contains("Rotary_class")) {
            window[`PDO_forced_FG_${i}`].innerText = FG_pos_rot.value;
          } else {
            window[`PDO_forced_FG_${i}`].innerText = FG_pos_lin.value;
          }
        } else {
          if (dom("body").classList.contains("Rotary_class")) {
            aux_array_options = FG_pos_rot_units;
          } else {
            aux_array_options = FG_pos_lin_units;
          }
        }
      } else if (aux_FG_type == "spd") {
        if (dom("body").classList.contains("FactorGroupEnabled")) {
          if (dom("body").classList.contains("Rotary_class")) {
            window[`PDO_forced_FG_${i}`].innerText = FG_spd_rot.value;
          } else {
            window[`PDO_forced_FG_${i}`].innerText = FG_spd_lin.value;
          }
        } else {
          if (dom("body").classList.contains("Rotary_class")) {
            aux_array_options = FG_spd_rot_units;
          } else {
            aux_array_options = FG_spd_lin_units;
          }
        }
      } else if (aux_FG_type == "acc") {
        if (dom("body").classList.contains("FactorGroupEnabled")) {
          if (dom("body").classList.contains("Rotary_class")) {
            window[`PDO_forced_FG_${i}`].innerText = FG_acc_rot.value;
          } else {
            window[`PDO_forced_FG_${i}`].innerText = FG_acc_lin.value;
          }
        } else {
          if (dom("body").classList.contains("Rotary_class")) {
            aux_array_options = FG_acc_rot_units;
          } else {
            aux_array_options = FG_acc_lin_units;
          }
        }
      } else if (aux_FG_type == "time") {
        if (dom("body").classList.contains("FactorGroupEnabled")) {
          window[`PDO_forced_FG_${i}`].innerText = FG_time_units.value;
        } else {
          //Do not care if Rotary or linear
          aux_array_options = FG_time_possible_units;
        }
      }

      if (!dom("body").classList.contains("FactorGroupEnabled")) {
        //Removing the previous dropdown options
        if (
          window[`PDO_helping_FG_${i}`].parentElement.querySelector(
            ".dropdown_options"
          ) != null
        ) {
          window[`PDO_helping_FG_${i}`].parentElement
            .querySelector(".dropdown_options")
            .remove();
        }

        const dropdown_options = document.createElement("div");
        window[`PDO_helping_FG_${i}`].parentElement.appendChild(
          dropdown_options
        );
        dropdown_options.setAttribute("class", "dropdown_options");

        //Creating  FG dropdown

        aux_array_options.forEach((option_text) => {
          var option_p = document.createElement("p");
          dropdown_options.appendChild(option_p);
          option_p.innerText = option_text;
          option_p.addEventListener("click", (ee) => {
            ee.target.parentElement.previousElementSibling.value = option_text;
            ee.target.parentElement.parentElement.classList.toggle("active");
          });
        });
      }
    }
  }
}
/*------------------------------------*/
//   Function    : CodeSDO()
//   Description : A function that looks at the input fields on DOM and codes a SDO message
/*------------------------------------*/
function CodeSDO() {
  var aux_cob_id = Compose_msgAxisID.value;
  var aux_obj = SDO_obj_input_CM.value;
  var aux_subindex = SDO_subindex_value_CM.value;
  var aux_value = SDO_input_value_CM.value;
  var aux_objectDetails;
  var aux_cs;
  var aux_msgLen;
  if (aux_subindex == "00") {
    aux_objectDetails = GetObject(aux_obj);
  } else {
    aux_objectDetails = GetObject(`${aux_obj}${aux_subindex}`);
  }
  //CobId
  aux_cob_id = parseInt(aux_cob_id) + 1536;
  aux_cob_id = decToHex(aux_cob_id, 16);
  if (A1_ComposeCANmsgs_UI.classList.contains("Read_SDO_CM")) {
    //----read SDO

    aux_cs = "40";
    aux_msgLen = 4;
    aux_value = "";
  } else {
    //----write SDO

    //Obj
    var isFG = FG_object(`${aux_obj}_${aux_subindex}`);
    //data

    if (isFG != "nothing") {
      //Obj contains FG
      if (aux_value == "") {
        aux_value = "0";
      }

      if (dom("body").classList.contains("FactorGroupEnabled")) {
        //FG enabled but we treat it as IU
        aux_value = Math.floor(aux_value);
        aux_value = aux_value.toString();
        if (isFG == "time") {
          aux_value = check_validity_decimal(aux_value, 16);
          SDO_input_value_CM.value = aux_value;
          aux_value = decToHex(aux_value, 16);
        } else {
          aux_value = check_validity_decimal(aux_value, 32);
          SDO_input_value_CM.value = aux_value;
          aux_value = decToHex(aux_value, 32);
        }
      } else {
        //Helping factor Group
        var units = SDO_helping_FG.value;

        //value in DEC
        aux_value = UnitsConvertor(
          aux_value,
          units,
          "IU",
          OneRot_IU_value.value,
          `${aux_obj}_${aux_subindex}`
        );

        if (isFG == "pos") {
          aux_value = Math.floor(aux_value);
          aux_value = decToHex(aux_value, 32);
        } else if (isFG == "time") {
          aux_value = Math.floor(aux_value);
          aux_value = decToHex(aux_value, 16);
        } else {
          //spd and acc shifted with 16 bits;

          aux_value = Math.floor(aux_value * Math.pow(2, 16));

          aux_value = decToHex(aux_value, 32);
        }
      }
    }
    aux_value = aux_value.toString();

    if (aux_objectDetails[2] == "32") {
      aux_cs = "23";
      aux_msgLen = 8;
      aux_value = aux_value.padStart(8, "0");
    } else if (aux_objectDetails[2] == "16") {
      aux_cs = "2B";
      aux_msgLen = 6;
      aux_value = aux_value.padStart(4, "0");
    } else if (aux_objectDetails[2] == "8") {
      aux_cs = "2F";
      aux_msgLen = 5;
      aux_value = aux_value.padStart(2, "0");
    } else if (aux_objectDetails[2] == "24") {
      aux_cs = "27";
      aux_msgLen = 7;
      aux_value = aux_value.padStart(6, "0");
    }
  }

  aux_obj = L2B_endian(aux_obj);
  aux_value = L2B_endian(aux_value);
  aux_value = devideStrBy2(aux_value);

  var message = `${aux_cs} <span class="success">${aux_obj}</span> ${aux_subindex} <span class="danger">${aux_value}</span>`;
  return [aux_cob_id, aux_msgLen, message];
}

function CodePDO() {
  //PROT_1: Objects not in order
  if (
    (pdo_obj_value_1.value == "" &&
      (pdo_obj_value_2.value != "" ||
        pdo_obj_value_3.value != "" ||
        pdo_obj_value_4.value != "")) ||
    (pdo_obj_value_2.value == "" &&
      (pdo_obj_value_3.value != "" || pdo_obj_value_4.value != "")) ||
    (pdo_obj_value_3.value == "" && pdo_obj_value_4.value != "")
  ) {
    ErrorModal("Please choose the mapped objects in order");
    return "Error";
  }

  var valid_obj_1 = 0;
  var valid_obj_2 = 0;
  var valid_obj_3 = 0;
  var valid_obj_4 = 0;

  var aux_obj_1 = GetObject(
    `${pdo_obj_value_1.value}_${PDO_subindex_input_1.value}`
  );
  if (aux_obj_1[1] != "??") {
    valid_obj_1 = 1;
  }
  var aux_obj_2 = GetObject(
    `${pdo_obj_value_2.value}_${PDO_subindex_input_2.value}`
  );
  if (aux_obj_2[1] != "??" || aux_obj_2[0] == "_00") {
    valid_obj_2 = 1;
  }
  var aux_obj_3 = GetObject(
    `${pdo_obj_value_3.value}_${PDO_subindex_input_3.value}`
  );
  if (aux_obj_3[1] != "??" || aux_obj_3[0] == "_00") {
    valid_obj_3 = 1;
  }
  var aux_obj_4 = GetObject(
    `${pdo_obj_value_4.value}_${PDO_subindex_input_4.value}`
  );
  if (aux_obj_4[1] != "??" || aux_obj_4[0] == "_00") {
    valid_obj_4 = 1;
  }

  if (valid_obj_1 == 0) {
    ErrorModal("Object 1 is not a valid object");
    return "Error";
  } else if (valid_obj_2 == 0) {
    ErrorModal("Object 2 is not a valid object");
    return "Error";
  } else if (valid_obj_3 == 0) {
    ErrorModal("Object 3 is not a valid object");
    return "Error";
  } else if (valid_obj_4 == 0) {
    ErrorModal("Object 4 is not a valid object");
    return "Error";
  }
  obj_size_1 = parseInt(aux_obj_1[2]);
  obj_size_2 = parseInt(aux_obj_2[2]);
  obj_size_3 = parseInt(aux_obj_3[2]);
  obj_size_4 = parseInt(aux_obj_4[2]);

  var sum = obj_size_1 + obj_size_2 + obj_size_3 + obj_size_4;
  if (sum > 64) {
    ErrorModal(`The size of all objects is over 64 bits  
    ${obj_size_1} + ${obj_size_2} + ${obj_size_3} + ${obj_size_4} > 64 bits
    `);

    return "Error";
  }

  //COBID
  var aux_cob_id = Compose_msgAxisID.value;
  //CobId

  if (typePDO_CM_g == 1) {
    aux_cob_id = parseInt(aux_cob_id) + 512;
    aux_cob_id = decToHex(aux_cob_id, 16);
  } else if (typePDO_CM_g == 2) {
    aux_cob_id = parseInt(aux_cob_id) + 768;
    aux_cob_id = decToHex(aux_cob_id, 16);
  } else if (typePDO_CM_g == 3) {
    aux_cob_id = parseInt(aux_cob_id) + 1024;
    aux_cob_id = decToHex(aux_cob_id, 16);
  } else if (typePDO_CM_g == 4) {
    aux_cob_id = parseInt(aux_cob_id) + 1280;
    aux_cob_id = decToHex(aux_cob_id, 16);
  }

  //Input VALUE of objects
  var final_msg = "";
  for (var i = 1; i < 5; i++) {
    //OBJECTS
    window[`aux_value_${i}`] = window[`PDO_input_value_CM_${i}`].value;
    var obj = window[`pdo_obj_value_${i}`].value;
    var sub_obj = window[`PDO_subindex_input_${i}`].value;
    window[`isFG_${i}`] = FG_object(`${obj}_${sub_obj}`);

    //data

    if (window[`isFG_${i}`] != "nothing") {
      //Obj contains FG
      if (window[`aux_value_${i}`] == "") {
        window[`aux_value_${i}`] = "0";
      }

      if (dom("body").classList.contains("FactorGroupEnabled")) {
        //FG enabled but we treat it as IU
        window[`aux_value_${i}`] = Math.floor(window[`aux_value_${i}`]);
        window[`aux_value_${i}`] = window[`aux_value_${i}`].toString();
        if (window[`isFG_${i}`] == "time") {
          window[`aux_value_${i}`] = check_validity_decimal(
            window[`aux_value_${i}`],
            16
          );
          window[`PDO_input_value_CM_${i}`].value = window[`aux_value_${i}`];
          window[`aux_value_${i}`] = decToHex(window[`aux_value_${i}`], 16);
        } else {
          window[`aux_value_${i}`] = check_validity_decimal(
            window[`aux_value_${i}`],
            32
          );
          window[`PDO_input_value_CM_${i}`].value = window[`aux_value_${i}`];
          window[`aux_value_${i}`] = decToHex(window[`aux_value_${i}`], 32);
        }
      } else {
        //Helping factor Group
        var units = window[`PDO_helping_FG_${i}`].value;

        //value in DEC
        window[`aux_value_${i}`] = UnitsConvertor(
          window[`aux_value_${i}`],
          units,
          "IU",
          OneRot_IU_value.value,
          `${obj}_${sub_obj}`
        );

        if (window[`isFG_${i}`] == "pos") {
          window[`aux_value_${i}`] = Math.floor(window[`aux_value_${i}`]);
          window[`aux_value_${i}`] = decToHex(window[`aux_value_${i}`], 32);
        } else if (window[`isFG_${i}`] == "time") {
          window[`aux_value_${i}`] = Math.floor(window[`aux_value_${i}`]);
          window[`aux_value_${i}`] = decToHex(window[`aux_value_${i}`], 16);
        } else {
          //spd and acc shifted with 16 bits;

          window[`aux_value_${i}`] = Math.floor(
            window[`aux_value_${i}`] * Math.pow(2, 16)
          );

          window[`aux_value_${i}`] = decToHex(window[`aux_value_${i}`], 32);
        }
      }
    }
    window[`aux_value_${i}`] = window[`aux_value_${i}`].toString();

    if (window[`obj_size_${i}`] == "32") {
      window[`aux_value_${i}`] = window[`aux_value_${i}`].padStart(8, "0");
    } else if (window[`obj_size_${i}`] == "16") {
      window[`aux_value_${i}`] = window[`aux_value_${i}`].padStart(4, "0");
    } else if (window[`obj_size_${i}`] == "8") {
      window[`aux_value_${i}`] = window[`aux_value_${i}`].padStart(2, "0");
    }

    window[`aux_value_${i}`] = L2B_endian(window[`aux_value_${i}`]);

    var aux_txt = window[`aux_value_${i}`];
    aux_txt = devideStrBy2(aux_txt);
    final_msg += `<span class="c_${i}">${aux_txt}</span> `;
  }

  var msglen = sum / 8;
  return [aux_cob_id, msglen, final_msg];
}

function CodeNMT() {
  var aux_cob_id = "000";
  var msglen = "2";
  //AxisID
  var aux = Compose_msgAxisID.value;
  aux = decToHex(aux, 16);
  if (A1_ComposeCANmsgs_UI.classList.contains("NMT_broadcastMSG")) {
    aux = "00";
  }
  aux = aux.padStart(2, "0");
  var aux1 = NMT_options.value.slice(2, 4);

  final_msg = `<span class="danger">${aux1}</span> <span class="success">${aux}</span>`;
  return [aux_cob_id, msglen, final_msg];
}

/*------------------------------------*/
/*IN: Input_field_Error(Parent_which_contains_input_field)*/
/* <div  id="Parent_which_contains_input_field">
  <input type="text" class="input_5" >
</div> */
/*OUT: Border animation depending if danger or success */
//Remark: the input must have class :input_5

function Input_field_Error(input_id_divParent) {
  input_id_divParent.classList.add("border_danger");
  input_id_divParent.classList.remove("border_success");
  setTimeout(() => {
    input_id_divParent.classList.remove("border_danger");
  }, 6000);
}
function Input_field_Success(input_id_divParent) {
  input_id_divParent.classList.add("border_success");
  input_id_divParent.classList.remove("border_danger");

  setTimeout(() => {
    input_id_divParent.classList.remove("border_success");
  }, 3000);
}
