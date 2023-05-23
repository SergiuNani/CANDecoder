/* ---------------- ---------------- ---------------- ---------------- ---------------- */
/* ---------------- ---------------- User Settings UI ----------------  ---------------- */
/* ---------------- ---------------- ---------------- ---------------- ---------------- */

//Actually User settings
open_UserSettings_UI.addEventListener("click", () => {
  dom("body").classList.toggle("open_UserSettings_UI");
});
close_FG_pref_UI.addEventListener("click", () => {
  dom("body").classList.toggle("open_UserSettings_UI");
});

//Extent the Load type menu
Expand_Load_type_menu_CM.addEventListener("click", () => {
  dom("body").classList.toggle("Expand_Load_type_menu_CM");
});

checkboxes_R_L.addEventListener("change", (e) => {
  dom("body").classList.toggle("Rotary_class");
  Update_units_g();
  SDO_helping_FG.value = "IU";
  PDO_helping_FG_1.value = "IU";
  PDO_helping_FG_2.value = "IU";
  PDO_helping_FG_3.value = "IU";
  PDO_helping_FG_4.value = "IU";

  QuickConvertionUpdate(e);
});

Expand_FG_menu_CM.addEventListener("click", () => {
  dom("body").classList.toggle("Expand_FG_menu_CM");
});
FG_parent.addEventListener("change", () => {
  dom("body").classList.toggle("FactorGroupEnabled");
  Update_units_g();
});

/* ----------------  ---------------- ---------------- ---------------- */
/* ---------------- Quick Conversion - User Settings UI   ---------------- */
/* ----------------  ---------------- ---------------- ---------------- */

//Side options
checkboxes_QuickConvertor.addEventListener("change", (e) => {
  QuickConvertionUpdate(e);
});
// on Focus all the input fields, if 0 then delete it and show it nicely ""
Value_before_QuickConvertion.addEventListener("focus", () => {
  if (parseInt(Value_before_QuickConvertion.value) == 0) {
    Value_before_QuickConvertion.value = "";
  }
});
hex_after_QuickConvertion.addEventListener("focus", () => {
  if (parseInt(hex_after_QuickConvertion.value) == 0) {
    hex_after_QuickConvertion.value = "";
  }
});
LEndian_after_QuickConvertion.addEventListener("focus", () => {
  if (parseInt(LEndian_after_QuickConvertion.value) == 0) {
    LEndian_after_QuickConvertion.value = "";
  }
});

//First input Field
Value_before_QuickConvertion.addEventListener("input", (e) => {
  //Getting rid of typo

  Value_before_QuickConvertion.value = checkVal_dec_comma(
    Value_before_QuickConvertion.value,
    0
  );
  var ConvertionType = aux_Find_QC_type();

  if (
    Value_before_QuickConvertion.value != "-" ||
    Value_before_QuickConvertion.value[
      Value_before_QuickConvertion.value.length - 1
    ] != "."
  ) {
    var ConvertionType = aux_Find_QC_type();
    var temp_dec_IU = UnitsConvertor(
      Value_before_QuickConvertion.value,
      Units_before_QuickConvertion.value,
      "IU",
      OneRot_IU_value.value,
      ConvertionType[1]
    );
    if (ConvertionType[0] == "time") {
      temp_dec_IU = Math.round(temp_dec_IU);
      if (temp_dec_IU < 0) {
        temp_dec_IU = 0;
      } else if (temp_dec_IU > 65535) {
        temp_dec_IU = 65535;
      }
    } else if (ConvertionType[0] == "pos") {
      temp_dec_IU = Math.round(temp_dec_IU);
      if (temp_dec_IU < -2147483648) {
        temp_dec_IU = -2147483648;
      } else if (temp_dec_IU > 2147483647) {
        temp_dec_IU = 2147483647;
      }
    } else if (ConvertionType[0] == "spd" || ConvertionType[0] == "acc") {
      if (temp_dec_IU < -32768) {
        temp_dec_IU = -32768;
      } else if (temp_dec_IU > 32767.9) {
        temp_dec_IU = 32767.99899;
      }
    }

    var temp_dec_IU_2 = UnitsConvertor(
      Value_before_QuickConvertion.value,
      Units_before_QuickConvertion.value,
      "IU",
      OneRot_IU_value.value,
      ConvertionType[1]
    );
    var FirstField_after_improvements_inUnits = UnitsConvertor(
      temp_dec_IU,
      "IU",
      Units_before_QuickConvertion.value,
      OneRot_IU_value.value,
      ConvertionType[1]
    );

    if (Math.abs(parseFloat(temp_dec_IU_2) - parseFloat(temp_dec_IU)) > 0.1) {
      Value_before_QuickConvertion.value =
        FirstField_after_improvements_inUnits;
    }

    QuickConvertionUpdate(e);
  }
});
// UNITS input field
Units_before_QuickConvertion.addEventListener("wheel", (e) => {
  e.preventDefault();
  e.stopPropagation();
  var previousUnit = "IU";
  var allTypesAtTheMoment = Units_before_QuickConvertion.parentElement
    .querySelector(".dropdown_options")
    .querySelectorAll("p");
  for (var i = 0; i < allTypesAtTheMoment.length; i++) {
    if (
      allTypesAtTheMoment[i].innerText == Units_before_QuickConvertion.value
    ) {
      previousUnit = Units_before_QuickConvertion.value;
      if (e.deltaY > 0) {
        if (allTypesAtTheMoment[i + 1] != undefined) {
          Units_before_QuickConvertion.value =
            allTypesAtTheMoment[i + 1].innerText;
        }
      } else {
        if (allTypesAtTheMoment[i - 1] != undefined) {
          Units_before_QuickConvertion.value =
            allTypesAtTheMoment[i - 1].innerText;
        }
      }
      i = allTypesAtTheMoment.length;
    }
  }

  var typeOfConvertion = aux_Find_QC_type();
  if (Value_before_QuickConvertion.value == "") {
    Value_before_QuickConvertion.value = "0";
  }
  Value_before_QuickConvertion.value = UnitsConvertor(
    Value_before_QuickConvertion.value,
    previousUnit,
    Units_before_QuickConvertion.value,
    OneRot_IU_value.value,
    typeOfConvertion[1]
  );
  QuickConvertionUpdate(e);
});
//Hex field
hex_after_QuickConvertion.addEventListener("input", (e) => {
  var ConvertionType = aux_Find_QC_type();
  if (ConvertionType[0] == "time") {
    hex_after_QuickConvertion.value = check_validity_hex(
      hex_after_QuickConvertion.value,
      16
    ).toUpperCase();
  } else {
    hex_after_QuickConvertion.value = check_validity_hex(
      hex_after_QuickConvertion.value,
      32
    ).toUpperCase();
  }
  var temp_dec_IU = hexToDec(hex_after_QuickConvertion.value, 32);

  if (ConvertionType[0] == "spd" || ConvertionType[0] == "acc") {
    temp_dec_IU = parseInt(temp_dec_IU) / 65536;
  }

  Value_before_QuickConvertion.value = UnitsConvertor(
    temp_dec_IU,
    "IU",
    Units_before_QuickConvertion.value,
    OneRot_IU_value.value,
    ConvertionType[1]
  );
  QuickConvertionUpdate(e);
});
//Endian Hex field
LEndian_after_QuickConvertion.addEventListener("input", (e) => {
  var ConvertionType = aux_Find_QC_type();
  if (ConvertionType[0] == "time") {
    LEndian_after_QuickConvertion.value = check_validity_hex(
      LEndian_after_QuickConvertion.value,
      16
    ).toUpperCase();
  } else {
    LEndian_after_QuickConvertion.value = check_validity_hex(
      LEndian_after_QuickConvertion.value,
      32
    ).toUpperCase();
  }
  var temp_dec_IU = L2B_endian(LEndian_after_QuickConvertion.value);
  temp_dec_IU = hexToDec(temp_dec_IU, 32);

  if (ConvertionType[0] == "spd" || ConvertionType[0] == "acc") {
    temp_dec_IU = parseInt(temp_dec_IU) / 65536;
  }

  Value_before_QuickConvertion.value = UnitsConvertor(
    temp_dec_IU,
    "IU",
    Units_before_QuickConvertion.value,
    OneRot_IU_value.value,
    ConvertionType[1]
  );
  QuickConvertionUpdate(e);
});
//Main function for Convertion
function QuickConvertionUpdate(e) {
  //This fct will assume every field is correct
  if (
    e.target.nodeName == "#document" ||
    e.target.parentElement.parentElement.id == "checkboxes_QuickConvertor" ||
    e.target.parentElement.parentElement.id == "checkboxes_R_L"
  ) {
    Units_before_QuickConvertion.value = "IU";
    Value_before_QuickConvertion.value = "0";
    Value_after_QuickConvertion.value = "0";
    hex_after_QuickConvertion.value = "00000000";
  }

  //Creation of the dropdown options
  var typeOfConvertion = aux_Find_QC_type();

  var aux_array_options = "";
  var object = "";

  if (typeOfConvertion[0] == "pos") {
    if (dom("body").classList.contains("Rotary_class")) {
      aux_array_options = FG_pos_rot_units;
    } else {
      aux_array_options = FG_pos_lin_units;
    }
    object = typeOfConvertion[1];
  } else if (typeOfConvertion[0] == "spd") {
    if (dom("body").classList.contains("Rotary_class")) {
      aux_array_options = FG_spd_rot_units;
    } else {
      aux_array_options = FG_spd_lin_units;
    }
    object = typeOfConvertion[1];
  } else if (typeOfConvertion[0] == "acc") {
    if (dom("body").classList.contains("Rotary_class")) {
      aux_array_options = FG_acc_rot_units;
    } else {
      aux_array_options = FG_acc_lin_units;
    }
    object = typeOfConvertion[1];
  } else if (typeOfConvertion[0] == "time") {
    aux_array_options = FG_time_possible_units;
    object = typeOfConvertion[1];
  }

  //Before -creating the dropdown

  if (e.target.id != "Units_before_QuickConvertion") {
    if (
      Units_before_QuickConvertion.parentElement.querySelector(
        ".dropdown_options"
      ) != null
    ) {
      Units_before_QuickConvertion.parentElement
        .querySelector(".dropdown_options")
        .remove();
    }

    var dropdown_options = document.createElement("div");
    Units_before_QuickConvertion.parentElement.appendChild(dropdown_options);
    dropdown_options.setAttribute("class", "dropdown_options");

    aux_array_options.forEach((option_text) => {
      var option_p = document.createElement("p");
      dropdown_options.appendChild(option_p);
      option_p.innerText = option_text;
      option_p.addEventListener("click", (ee) => {
        var typeOfConvertion = aux_Find_QC_type();

        Value_before_QuickConvertion.value = UnitsConvertor(
          Value_before_QuickConvertion.value,
          Units_before_QuickConvertion.value,
          option_text,
          OneRot_IU_value.value,
          typeOfConvertion[1]
        );
        ee.target.parentElement.previousElementSibling.value = option_text;
        ee.target.parentElement.parentElement.classList.toggle("active");
        QuickConvertionUpdate(ee);
      });
    });
  }
  //The main convertion

  var firstField2IU = UnitsConvertor(
    Value_before_QuickConvertion.value,
    Units_before_QuickConvertion.value,
    "IU",
    OneRot_IU_value.value,
    object
  );
  if (firstField2IU == "NaN") {
    firstField2IU = 0;
  }
  var secondField2IU = Value_after_QuickConvertion.value;
  var thirdField2IU = hexToDec(hex_after_QuickConvertion.value, 32);

  if (typeOfConvertion[0] == "spd" || typeOfConvertion[0] == "acc") {
    secondField2IU = secondField2IU / 65536;
    thirdField2IU = thirdField2IU / 65536;
  }

  if (Math.abs(firstField2IU - secondField2IU) > 0.001) {
    var temp = firstField2IU;
    if (typeOfConvertion[0] == "spd" || typeOfConvertion[0] == "acc") {
      temp *= 65536;
      temp = Math.floor(temp);
    }
    Value_after_QuickConvertion.value = Math.floor(temp);
  }

  if (
    Math.abs(firstField2IU - thirdField2IU) > 0.001 &&
    e.target.id != `hex_after_QuickConvertion`
  ) {
    var temp = firstField2IU;

    if (typeOfConvertion[0] == "spd" || typeOfConvertion[0] == "acc") {
      temp *= 65536;
      temp = Math.floor(temp);
    }
    temp = decToHex(temp, 32);
    if (typeOfConvertion[0] == "time") {
      temp = temp.toString().padStart(4, "0");
    } else {
      temp = temp.toString().padStart(8, "0");
    }
    hex_after_QuickConvertion.value = temp;
  }

  if (e.target.id != `LEndian_after_QuickConvertion`) {
    var temp = hex_after_QuickConvertion.value;

    if (typeOfConvertion[0] == "time") {
      temp = temp.toString().padStart(4, "0");
    } else {
      temp = temp.toString().padStart(8, "0");
    }
    temp = L2B_endian(temp);
    LEndian_after_QuickConvertion.value = temp;
  }
}

function aux_Find_QC_type() {
  var all_radio_QC = document.getElementsByName("radio_quickConvert");

  if (all_radio_QC[0].checked) {
    return ["pos", "607A"];
  } else if (all_radio_QC[1].checked) {
    return ["spd", "6081"];
  } else if (all_radio_QC[2].checked) {
    return ["acc", "6085"];
  } else if (all_radio_QC[3].checked) {
    return ["time", "6066"];
  }
}

/* ----------------  ---------------- ---------------- ---------------- */
/* ---------------- Quick COB ID - User Settings UI   ---------------- */
/* ----------------  ---------------- ---------------- ---------------- */

cobid_quick_input.addEventListener("input", () => {
  cobid_quick_input.value = check_validity_hex(
    cobid_quick_input.value,
    16
  ).toUpperCase();
  if (cobid_quick_input.value.length > 3) {
    cobid_quick_input.value = cobid_quick_input.value.slice(0, 3);
  }

  var tempo = CobID_who_dis(cobid_quick_input.value);
  if (tempo[1] == "-") {
    tempo[1] = "All Axes";
  } else if (tempo[1] == undefined) {
    tempo[1] = "-";
  }
  if (tempo[2] == undefined) {
    tempo[2] = "-";
  }
  if (cobid_quick_input.value == "") {
    tempo[2] = "-";
    tempo[1] = "-";
  }
  cobid_quick_type.value = tempo[2];
  cobid_quick_axisid.value = tempo[1];
});
