/****************************************/
/*Function Name: RegisterModal_btn -ID of the btn that opens up the Register Modal on click */
/***************************************/
//bug - please simplify thi
RegisterModal_btn.addEventListener("click", () => {
  TOP_NAV.classList.toggle("extentedRegisterModal");
  if (TOP_NAV.classList.contains("extentedRegisterModal")) {
    var no_modals = RegisterModal.querySelectorAll(".RM_single").length;
    if (no_modals == 0) {
      CreateOneRegisterModal();
    }
  }
});

/****************************************/
/*Function Name: CreateOneRegisterModal */
/*USE: Will create all three RM, one at a time and will also set the var Mouseover_RM_g==1 */
/* if the mouse is over the modals and 0 if it left */
/*IN: call CreateOneRegisterModal() */
/*OUT: Creates in DOM one modal at a time in the RegisterModal space*/
/***************************************/
var Mouseover_RM_g = 0;
function CreateOneRegisterModal() {
  if (RegisterModal.querySelector("#RM_single1") == null) {
    // First Modal
    var RM_single1 = document.createElement("div");
    RM_single1.setAttribute("id", "RM_single1");
    RM_single1.classList.add("RM_single");

    var RM_single_header1 = document.createElement("div");
    RM_single_header1.setAttribute("id", "RM_single_header1");
    RM_single_header1.classList.add("RM_single_header");

    var RM_single_body1 = document.createElement("div");
    RM_single_body1.setAttribute("id", "RM_single_body1");
    RM_single_body1.classList.add("RM_single_body");

    RM_single1.append(RM_single_header1, RM_single_body1);
    RegisterModal.append(RM_single1);
    createOneRegisterModal1(RM_single1);
    RM_single1.addEventListener("mouseover", () => {
      Mouseover_RM_g = 1;
    });
    RM_single1.addEventListener("mouseleave", () => {
      Mouseover_RM_g = 0;
    });
  } else if (RegisterModal.querySelector("#RM_single2") == null) {
    //Second Modal
    var RM_single2 = document.createElement("div");
    RM_single2.setAttribute("id", "RM_single2");
    RM_single2.classList.add("RM_single");

    var RM_single_header2 = document.createElement("div");
    RM_single_header2.setAttribute("id", "RM_single_header2");
    RM_single_header2.classList.add("RM_single_header");

    var RM_single_body2 = document.createElement("div");
    RM_single_body2.setAttribute("id", "RM_single_body2");
    RM_single_body2.classList.add("RM_single_body");

    RM_single2.append(RM_single_header2, RM_single_body2);
    RegisterModal.append(RM_single2);
    createOneRegisterModal1(RM_single2);
    RM_single2.addEventListener("mouseover", () => {
      Mouseover_RM_g = 1;
    });
    RM_single2.addEventListener("mouseleave", () => {
      Mouseover_RM_g = 0;
    });
  } else if (RegisterModal.querySelector("#RM_single3") == null) {
    //Third Modal
    var RM_single3 = document.createElement("div");
    RM_single3.setAttribute("id", "RM_single3");
    RM_single3.classList.add("RM_single");

    var RM_single_header3 = document.createElement("div");
    RM_single_header3.setAttribute("id", "RM_single_header3");
    RM_single_header3.classList.add("RM_single_header");

    var RM_single_body3 = document.createElement("div");
    RM_single_body3.setAttribute("id", "RM_single_body3");
    RM_single_body3.classList.add("RM_single_body");

    RM_single3.append(RM_single_header3, RM_single_body3);
    RegisterModal.append(RM_single3);
    createOneRegisterModal1(RM_single3);
    RM_single3.addEventListener("mouseover", () => {
      Mouseover_RM_g = 1;
    });
    RM_single3.addEventListener("mouseleave", () => {
      Mouseover_RM_g = 0;
    });
  }
}

/****************************************/
/*Function Name: createOneRegisterModal1(modalID) */
/*USE: Will use the space created by the previous function and populate the Header and body of the RM */
/*USE: with two input bars, closing btn, plus button and a Standard_to_THS btn  */
/***************************************/

function createOneRegisterModal1(modalID) {
  var id = modalID.id[9];

  //title

  var h1 = document.createElement("h1");
  h1.innerHTML = `Register Bit Representation`;

  //div parent for the second row from the RM
  var div_input_parent = document.createElement("div");
  div_input_parent.setAttribute("class", "div_RegisterModal_header_elements");

  //close button

  var close_btn = document.createElement("button");
  close_btn.setAttribute("id", `RM_close_btn${id}`);
  close_btn.classList.add("RM_close_btn", "fa", "fa-times");

  //First input

  var seach_register_input_modal = document.createElement("input");
  seach_register_input_modal.setAttribute("id", `RM_search_input${id}`);
  seach_register_input_modal.setAttribute("autocomplete", `off`);
  seach_register_input_modal.classList.add("input_1");
  seach_register_input_modal.placeholder = "Index";
  //aux_div was added for the drop down menu to be arranged perfectly
  var aux_div = document.createElement("div");
  aux_div.appendChild(seach_register_input_modal);

  //second Input
  var value_register_input_modal = document.createElement("input");
  value_register_input_modal.setAttribute("id", `RM_value_input${id}`);
  value_register_input_modal.setAttribute("autocomplete", `off`);
  value_register_input_modal.classList.add("input_1");
  value_register_input_modal.placeholder = "Hex";

  //Button with options: Standard or Technosoft;
  var Standard_or_Ths_btn = document.createElement("button");
  Standard_or_Ths_btn.setAttribute("id", `Standard_or_Ths_btn${id}`);
  Standard_or_Ths_btn.classList.add("button-7");
  Standard_or_Ths_btn.innerText = "Standard";

  //Adding more modals
  var add_btn = document.createElement("button");
  add_btn.setAttribute("id", `RM_add_btn${id}`);
  add_btn.classList.add("fa", "fa-plus");

  //Appeding all the elements in the Header of the Modal
  div_input_parent.append(
    close_btn,
    aux_div,
    value_register_input_modal,
    Standard_or_Ths_btn,
    add_btn
  );

  modalID.children[0].append(h1, div_input_parent);

  //ADDING FUNCTIONALITY
  window[`RM_add_btn${id}`].addEventListener("click", CreateOneRegisterModal);
  window[`RM_close_btn${id}`].addEventListener("click", RM_close_btn_fct);
  window[`Standard_or_Ths_btn${id}`].addEventListener(
    "click",
    Standard_or_Ths_btn_fct
  );
  window[`RM_search_input${id}`].addEventListener(
    "keyup",
    createDropDownTHSRegisters
  );
  window[`RM_search_input${id}`].addEventListener(
    "focus",
    createDropDownTHSRegisters
  );

  window[`RM_search_input${id}`].addEventListener(
    "keyup",
    RM_reactToValueChange
  );
  window[`RM_value_input${id}`].addEventListener(
    "keyup",
    RM_reactToValueChange
  );
}

/****************************************/
/*Function Name: RM_close_btn_fct(e) */
/*USE: When the X btn of any of the three RM is pressed , then those RM modals will be deleted respectevily */
/***************************************/
function RM_close_btn_fct(e) {
  var no_modals = RegisterModal.querySelectorAll(".RM_single").length;
  if (no_modals == 1) {
    TOP_NAV.classList.toggle("extentedRegisterModal");
    //bug -  closing one will close all
  }
  e.target.parentElement.parentElement.parentElement.remove();
}

/****************************************/
/*Function Name: Standard_or_Ths_btn_fct(e)*/
/*USE: When the Standard btn of any of the three RM is pressed , then the modal will have access to THS registers or vici versa */
/***************************************/
function Standard_or_Ths_btn_fct(e) {
  var a;
  if (e.target.innerText == "Standard") {
    e.target.innerText = "Technosoft";
    e.target.style.color = "var(--color-success)";
    e.target.parentElement.children[1].children[0].value = "";
    e.target.parentElement.children[2].value = "";
    if (
      e.target.parentElement.parentElement.parentElement.children[1]
        .children[0] != undefined
    ) {
      //If there is a register drawn it will be deleted
      e.target.parentElement.parentElement.parentElement.children[1].children[0].remove();
    }

    //Deleting the existing dropdowns
    var no_dropdowns = RegisterModal.querySelectorAll(".dropDown_parent");
    no_dropdowns.forEach((menu) => {
      menu.remove();
    });
  } else {
    e.target.innerText = "Standard";
    e.target.style.color = "var(--color-dark)";
    e.target.parentElement.children[1].children[0].value = "";
    e.target.parentElement.children[2].value = "";
    if (
      e.target.parentElement.parentElement.parentElement.children[1]
        .children[0] != undefined
    ) {
      //If there is a register drawn it will be deleted
      e.target.parentElement.parentElement.parentElement.children[1].children[0].remove();
    }

    //Deleting the existing dropdowns
    var no_dropdowns = RegisterModal.querySelectorAll(".dropDown_parent");
    no_dropdowns.forEach((menu) => {
      menu.remove();
    });
  }
}

/****************************************/
/*Function Name: createDropDownTHSRegisters(e)(e)*/
/*USE: When the Index input bar is clicked then a drop down menu will be generating containing all the*/
/*USE: supported registers which are contained in the DICT.xml file */
/***************************************/

var request_drawRegister = 0;
function createDropDownTHSRegisters(e) {
  e.target.value = e.target.value.toUpperCase();

  //deleting the previous dropdownMenu;
  if (
    e.target.parentElement.parentElement.querySelector(".dropDown_parent") !=
    null
  ) {
    e.target.parentElement.parentElement
      .querySelector(".dropDown_parent")
      .remove();
  }
  //div_parent - is the div which contains all the register list
  var div_parent = document.createElement("div");

  div_parent.classList.add("dropDown_parent");
  if (
    e.target.parentElement.parentElement.children[3].innerText == "Technosoft"
  ) {
    for (var j = 0; j < All_THS_registers_g.length; j++) {
      if (
        All_THS_registers_g[j].children[0].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1 ||
        All_THS_registers_g[j].children[1].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1
      ) {
        var div = document.createElement("div");
        div.innerText = `${All_THS_registers_g[j].children[0].innerHTML} - ${All_THS_registers_g[j].children[1].innerHTML}`;
        div.classList.add("one_DropDown_element");

        div.addEventListener("click", (ee) => {
          var aux = ee.target.innerText;
          aux = aux.slice(0, 4);
          aux = removeSpaces(aux);
          if (aux == "UPGR") {
            aux = "UPGRADE";
          }
          e.target.value = aux;

          request_drawRegister = 1;
          RM_reactToValueChange(e);

          div_parent.remove();
        });
        div_parent.appendChild(div);
      }
    }
  } else {
    for (var j = 0; j < All_registers_g.length; j++) {
      if (
        All_registers_g[j].children[0].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1 ||
        All_registers_g[j].children[1].innerHTML
          .toUpperCase()
          .indexOf(e.target.value.toUpperCase()) > -1
      ) {
        var div = document.createElement("div");
        div.innerText = `${All_registers_g[j].children[0].innerHTML}    - ${All_registers_g[j].children[1].innerHTML}`;
        div.classList.add("one_DropDown_element");

        div.addEventListener("click", (ee) => {
          var aux = ee.target.innerText;
          aux = aux.slice(0, 6);
          aux = removeSpaces(aux);
          e.target.value = check_validity_hex(aux, 32);
          request_drawRegister = 1;
          RM_reactToValueChange(e);
          div_parent.remove();
        });
        div_parent.appendChild(div);
      }
    }
  }

  e.target.parentElement.append(div_parent);
  div_parent.style.position = "absolute";
  div_parent.style.left = "2rem";
}

/****************************************/
/*Function Name: THS_two_nums_strings_min_max(str)*/
/*USE: Mainly used for THS_register_to_XML2(text),used for inputing a string and it returning an array */
/*USE: of max and min of the inputed string*/
/*IN: string (first char must be nr) || ex: "12-9","15", "bird" */
/*OUT: [max, min], 15,  null*/
/***************************************/
function THS_two_nums_strings_min_max(str) {
  str = str.split("");
  var temp;
  var temp1 = "";
  var ii = 0;

  if (isNaN(str[0])) {
    return null;
  }

  if (!isNaN(str[1])) {
    temp = str[0].concat(str[1]);
  } else {
    temp = str[0];
  }
  if (str.length == 1 || str.length == 2) {
    return temp;
  }

  //multi numbers
  for (var i = 2; i < str.length; i++) {
    if (!isNaN(str[i])) {
      if (!isNaN(str[i + 1])) {
        temp1 = str[i].concat(str[i + 1]);
        i = str.length;
      } else {
        temp1 = str[i];
        i = str.length;
      }
    }
  }

  if (parseInt(temp) > parseInt(temp1)) {
    return [temp, temp1];
  } else {
    return [temp1, temp];
  }
}

/*Adds an event listener to the DOM that if the dropDown search results are displayed - it will be deleted*/
overlay.addEventListener("click", () => {
  if (Mouseover_RM_g == 0) {
    //if mouse is outside RM then
    //remove all the dropDowns from the RegisterModals search options with a click outside the RM
    var no_dropdowns = RegisterModal.querySelectorAll(".dropDown_parent");
    no_dropdowns.forEach((menu) => {
      menu.remove();
    });
  }
});

/****************************************/
/*Function Name: RM_ColorAndCalcBIN(RM_modal)*/
/*USE: Adds an event listerner for all the bits values (0/1) that if they are clicked they will change  */
/*USE: between each other, also it will enable a different color based on the value */
/*USE: This fct will also recalculate the value of the bits and will go into the RM value input and modify it accordingly */
/****************************************/
var recursive_flag = 0;
function RM_ColorAndCalcBIN(RM_modal) {
  if (
    RM_modal.parentElement.parentElement.parentElement.id == "RegisterModal" &&
    recursive_flag == 0
  ) {
    //Adding EventListeners to those bits which are contained in RegisterModal space
    var ALL_RM_onebitValue = RM_modal.querySelectorAll(".RM_onebitValue");
    ALL_RM_onebitValue.forEach((bitElem) => {
      bitElem.addEventListener("click", (e) => {
        if (e.target.innerText == "1") {
          e.target.innerText = "0";
        } else {
          e.target.innerText = "1";
        }
        recursive_flag = 1;

        RM_ColorAndCalcBIN(RM_modal);
      });
    });
  }

  var binVal = "";
  var ALL_RM_onebitValue = RM_modal.querySelectorAll(".RM_onebitValue");
  for (var i = 0; i < ALL_RM_onebitValue.length; i++) {
    if (ALL_RM_onebitValue[i].innerText == "1") {
      ALL_RM_onebitValue[i].style.color = "var(--color-danger)";
    } else {
      ALL_RM_onebitValue[i].style.color = "var(--color-success)";
    }
    binVal = binVal.concat(ALL_RM_onebitValue[i].innerText);
  }

  var hexVal = bin2hex(binVal);
  if (
    RM_modal.parentElement.parentElement.parentElement.id == "RegisterModal" &&
    RM_modal.parentElement.parentElement.children[0].children[1].children[2] !=
      undefined
  ) {
    if (
      RM_modal.parentElement.parentElement.children[0].children[1].children[2].classList.contains(
        "DEC"
      )
    ) {
      RM_modal.parentElement.parentElement.children[0].children[1].children[2].value =
        hexToDec(hexVal, 32);
    } else {
      RM_modal.parentElement.parentElement.children[0].children[1].children[2].value =
        hexVal;
    }
  }

  recursive_flag = 0;

  //Coloring specific description which depends on more than one bit

  var All_lines_oneRM = RM_modal.querySelectorAll(
    ".RM_OneBitRepresentationLine"
  );

  All_lines_oneRM.forEach((line) => {
    var nr_of_descriptions_perLine =
      line.querySelectorAll(".RM_bitDes_value").length;

    if (nr_of_descriptions_perLine > 2) {
      //Deleting all the prev selected options
      line.querySelectorAll(".CorrectOption_selected").forEach((el2Remove) => {
        el2Remove.classList.remove("CorrectOption_selected");
      });

      var valueBIN = ""; //Uniting all bits from a line to determine which case is chosen
      var all_bitsValues = line.children[2].querySelectorAll(".RM_onebitValue");
      all_bitsValues.forEach((bitValue) => {
        valueBIN = valueBIN.concat(bitValue.innerText);
      });

      var All_possible_values = line.querySelectorAll(".RM_bitDes_value");
      All_possible_values.forEach((posComb) => {
        if (posComb.innerText == valueBIN) {
          posComb.classList.add("CorrectOption_selected");
          posComb.nextElementSibling.classList.add("CorrectOption_selected");
        }
      });
    }
  });
}

/****************************************/
/*Function Name: RM_reactToValueChange(e)*/
/*USE: If the value of the value input bar of any of the RM changes then that input will be filtered  */
/*USE: aka, deleted if they are not dec or hex, also it enables to draw the RM if ENTER is pressed*/
/****************************************/
function RM_reactToValueChange(e) {
  var Index_field;
  var value_field;
  var ths_standard;
  var RM_body_space;

  if (e.target.id.slice(0, 14) == "RM_value_input") {
    Index_field = e.target.parentElement.children[1].children[0];
    value_field = e.target;
    ths_standard = e.target.parentElement.children[3].innerText;
    RM_body_space =
      e.target.parentElement.parentElement.parentElement.children[1];
  } else if (e.target.id.slice(0, 15) == "RM_search_input") {
    Index_field = e.target;
    value_field = e.target.parentElement.parentElement.children[2];
    ths_standard = e.target.parentElement.parentElement.children[3].innerText;
    RM_body_space =
      e.target.parentElement.parentElement.parentElement.parentElement
        .children[1];
  }
  //checking if the value is given in DEC or HEX

  if (value_field.classList.contains("DEC")) {
    value_field.value = check_validity_decimal(value_field.value, 32);
  } else {
    value_field.value = check_validity_hex(value_field.value, 32);
  }

  var aux_index = Index_field.value;
  var aux_value = value_field.value;

  //DRAW the Register
  if (request_drawRegister == 1 || e.key == "Enter") {
    request_drawRegister = 0;
    //Removing all the dropDown search results
    var no_dropdowns = RegisterModal.querySelectorAll(".dropDown_parent");
    no_dropdowns.forEach((menu) => {
      menu.remove();
    });

    var regFound = 0;
    if (ths_standard == "Standard") {
      //looking for CiA Registers
      for (var i = 0; i < All_registers_g.length; i++) {
        if (All_registers_g[i].children[0].innerHTML == aux_index) {
          aux_index = All_registers_g[i];
          i = All_registers_g.length;
          regFound = 1;
        }
      }
    } else {
      //looking for THS registers
      for (var i = 0; i < All_THS_registers_g.length; i++) {
        if (All_THS_registers_g[i].children[0].innerHTML == aux_index) {
          aux_index = All_THS_registers_g[i];
          i = All_THS_registers_g.length;
          regFound = 1;
        }
      }
    }

    //Register not found
    if (regFound == 0) {
      ErrorModal("Please select a valid Register");
      return;
    }

    //Adding a case for Decimal
    if (value_field.classList.contains("DEC")) {
      aux_value = decToHex(aux_value, 32);
    }
    DrawOneTHS_Register(aux_index, aux_value, RM_body_space);
  }
}

/****************************************/
/*Function ErrorModal(msg)*/
/*USE: Globally used fct to display Error messages . It will create a small modal displaying a specific error*/
/*IN: ErrorModal("This register does not exist")*/
/*OUT:Generated modal in the right corner which will display the msg and will dissapear or can be deleted*/
/****************************************/
function ErrorModal(msg) {
  var div_main_parent = document.createElement("div");
  div_main_parent.classList.add("errorModal");

  //exclamation
  let span1 = document.createElement("span");
  span1.classList.add("fa", "fa-exclamation-circle");
  //Warning message
  let span2 = document.createElement("span");
  span2.classList.add("errorModal_msg");
  span2.innerText = `Warning: ${msg}`;

  //closing btn
  let div_close_btn = document.createElement("div");
  div_close_btn.classList.add("EM_close_btn");

  let span3 = document.createElement("span");
  span3.classList.add("fa", "fa-times");
  div_close_btn.appendChild(span3);

  ErrorModal_mainContainer.append(div_main_parent);
  div_main_parent.append(span1, span2, div_close_btn);

  div_main_parent.classList.add("show");
  setTimeout(() => {
    div_main_parent.classList.add("hide");
  }, 6000);
  setTimeout(() => {
    div_main_parent.remove();
  }, 6300);

  var allCloseBTN = document.querySelectorAll(".EM_close_btn");

  for (var i = 0; i < allCloseBTN.length; i++) {
    allCloseBTN[i].addEventListener("click", (e) => {
      if (e.target.parentElement.classList.contains("EM_close_btn")) {
        e.target.parentElement.parentElement.classList.add("hide");
        setTimeout(() => {
          e.target.parentElement.parentElement.remove();
        }, 350);
      } else {
        e.target.parentElement.classList.add("hide");
        setTimeout(() => {
          e.target.parentElement.remove();
        }, 350);
      }
    });
  }
}

/****************************************/
/*Function Name: DrawOneTHS_Register(registerXML, valueHex, space)*/
/*USE: Based on the inputed space it will draw a specific register with a specific hex value*/
/*It supports both types of registers : CIA and THS */
/***************************************/
function DrawOneTHS_Register(registerXML, valueHex, space) {
  //deleting the existing Drawings, if exist
  if (valueHex == "") {
    valueHex = "0";
  }
  if (
    space.querySelector(".RM_bitsRepresentation_mainParent") != null &&
    (space.id == `RM_single_body1` ||
      space.id == `RM_single_body2` ||
      space.id == `RM_single_body3`)
  ) {
    space.querySelector(".RM_bitsRepresentation_mainParent").remove();
  }

  //Creating a new Drawing
  var div_mainParent = document.createElement("div");
  div_mainParent.classList.add("RM_bitsRepresentation_mainParent");
  space.append(div_mainParent);

  var All_BitInfo_XML = registerXML.querySelectorAll("BitInfo");
  //Hex to bin
  if (valueHex == "") {
    valueHex = 0;
  }
  var RegValueBin = hex2bin(valueHex);
  RegValueBin = RegValueBin.split("");
  var aux = THS_two_nums_strings_min_max(
    All_BitInfo_XML[0].children[0].innerHTML
  );
  if (typeof aux == "object") {
    if (parseInt(aux[0]) + 1 == 16) {
      RegValueBin.splice(0, 16);
    } else if (parseInt(aux[0]) + 1 == 8) {
      RegValueBin.splice(0, 24);
    }
  } else {
    if (parseInt(aux) + 1 == 16) {
      RegValueBin.splice(0, 16);
    } else if (parseInt(aux) + 1 == 8) {
      RegValueBin.splice(0, 24);
    }
  }
  //Inserting the title of the register

  var reg_title = document.createElement("div");
  div_mainParent.appendChild(reg_title);
  reg_title.innerHTML = `<p class='RM_title'>--Register: <span class ='RM_title1'>${registerXML.children[0].innerHTML}</span> - ${registerXML.children[1].innerHTML}</p>`;

  //For Each Bit we will separate the information into three parts
  for (var i = 0; i < All_BitInfo_XML.length; i++) {
    var RM_OneBitRepresentationLine = document.createElement("div");
    div_mainParent.appendChild(RM_OneBitRepresentationLine);
    RM_OneBitRepresentationLine.classList.add("RM_OneBitRepresentationLine");
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");
    var div3 = document.createElement("div");
    RM_OneBitRepresentationLine.append(div1, div2, div3);
    div1.classList.add("RM_bitNR");
    div2.classList.add("RM_bitDescription");
    div3.classList.add("RM_bitValues");

    //The bit nr---
    div1.innerHTML = All_BitInfo_XML[i].children[0].innerHTML;

    //Bit description--

    if (All_BitInfo_XML[i].children.length == 2) {
      //Bits that are Reserved or dont have specifications for value 1 or 2
      div2.innerHTML = All_BitInfo_XML[i].children[1].innerHTML;
      div2.style.padding = "0 1rem";
    } else {
      if (All_BitInfo_XML[i].children[1].tagName == "info") {
        // THS registers

        var aux2 = (All_BitInfo_XML[i].children.length - 2) / 2; //nr of pairs of value+info tag
        var aux_str = `<div class='lineTitle'>${All_BitInfo_XML[i].children[1].innerHTML}</div>`;
        for (var k = 0; k < aux2; k++) {
          aux_str = aux_str.concat(`<div  class='RM_linebro_sec'>
          <span class='RM_bitDes_value'>${
            All_BitInfo_XML[i].children[2 + 2 * k].innerHTML
          }</span>
          <p class='RM_bitDes_info'>${
            All_BitInfo_XML[i].children[3 + 2 * k].innerHTML
          }</p></div>
          `);
        }

        div2.innerHTML = aux_str;
        aux_str = "";
      } else {
        //Normal registers
        var aux2 = (All_BitInfo_XML[i].children.length - 1) / 2; //nr of pairs of value+info tag
        var aux_str = "";
        for (var k = 0; k < aux2; k++) {
          aux_str = aux_str.concat(`<div  class='RM_linebro_sec'>
          <span class='RM_bitDes_value'>${
            All_BitInfo_XML[i].children[1 + 2 * k].innerHTML
          }</span>
          <p class='RM_bitDes_info'>${
            All_BitInfo_XML[i].children[2 + 2 * k].innerHTML
          }</p></div>
          `);
        }

        div2.innerHTML = aux_str;
        aux_str = "";
      }
    }

    //Bit actual values---

    var aux = THS_two_nums_strings_min_max(
      All_BitInfo_XML[i].children[0].innerHTML
    );
    if (typeof aux == "object") {
      var aux1 = aux[0] - aux[1] + 1; //nr of bits that need to be drawn
      for (var j = 0; j < aux1; j++) {
        var oneBit = document.createElement("div");
        oneBit.classList.add("RM_onebitValue");
        div3.appendChild(oneBit);
        oneBit.innerText = RegValueBin.splice(0, 1);
      }
    } else {
      var oneBit = document.createElement("div");
      oneBit.classList.add("RM_onebitValue");
      div3.appendChild(oneBit);
      oneBit.innerText = RegValueBin.splice(0, 1);
    }
  }
  RM_ColorAndCalcBIN(div_mainParent);
}

//*****Converting Registers into  XML format------------------------------------------------------------------------------------------------------------------------------ */
/* Register to XML button*/
// Register2XML.addEventListener("click", Register2XML_fct);

function Register2XML_fct() {
  if (Register2XML.classList.contains("pressed")) {
    Register2XML.classList.remove("pressed");
    CreateXMLcode4Registers_space.style.display = "none";
    Register2XML.classList.remove("debug_on");
  } else {
    Register2XML.classList.add("pressed");
    CreateXMLcode4Registers_space.style.display = "block";
    Register2XML.classList.add("debug_on");
  }
}

//Activates this function prior so when called it will change display to block
// CreateXMLcode4Registers(CreateXMLcode4Registers_space);
//Draws the Ugly interface of the two textarea which converts normal register info into XML format
function CreateXMLcode4Registers(place) {
  const div_mainParent = document.createElement("div");
  div_mainParent.setAttribute("id", "Convert_reg_2_XML_window");
  place.append(div_mainParent);

  const textArea1 = document.createElement("textarea");
  textArea1.classList.add("r_textArea");
  textArea1.setAttribute("id", "textArea1");

  const textArea2 = document.createElement("textarea");
  textArea2.classList.add("r_textArea");
  textArea2.setAttribute("id", "textArea2");

  const btn_convert = document.createElement("button");

  btn_convert.innerText = "Convert to XML";
  btn_convert.setAttribute("id", "btn_convert_register");
  btn_convert.addEventListener("click", ConvertStandartRegister2XML);
  btn_convert.classList.add("button");

  const btn_choice_ths = document.createElement("button");
  btn_choice_ths.innerText = "Technosoft XML convert";
  btn_choice_ths.setAttribute("id", "btn_choice_ths");
  btn_choice_ths.addEventListener("click", THS_register_to_XML2);
  btn_choice_ths.classList.add("button");

  div_mainParent.append(textArea1, btn_convert, btn_choice_ths, textArea2);
}

//Function which takes a CiA register and converts it into XML
function ConvertStandartRegister2XML() {
  if (document.querySelector(" .delete_div_parent") != null) {
    document.querySelector(".delete_div_parent").remove();
  }
  str = textArea1.value;
  var bit_nr_arr = [];
  var description_arr = [];

  var arr_str = str;
  arr_str = arr_str.match(/[^\n]+/gm);
  arr_str = arr_str.join(" ");
  arr_str = arr_str.match(/[^ ]+/gm);

  var indicator;
  indicator = arr_str[0];
  var inc = 0;
  var b_aux = "";

  for (var i = 0; i < arr_str.length; i++) {
    var tell_index = arr_str[i].match(indicator);

    if (tell_index != null && tell_index.index < 7) {
      if (tell_index.input.length > 3) {
        indicator = str_get_min(tell_index.input) - 1;
      } else {
        indicator--;
      }
      bit_nr_arr[inc] = arr_str[i];
      inc++;
      b_aux = "";
    } else {
      b_aux = b_aux.concat(arr_str[i] + " ");
      description_arr[inc - 1] = b_aux;
    }
  }

  //separating the 0 and 1 bit description and putting them into an array=["0..","1..."]
  for (var i = 0; i < description_arr.length; i++) {
    var aux = description_arr[i].split(" ");
    aux = removeAnnoyingElementsFromArray(aux);
    if (aux[0] == "0") {
      var first;
      var second;
      for (var j = 0; j < aux.length; j++) {
        if (aux[j] == "1") {
          first = aux.slice(0, j);
          first = first.join(" ");
          second = aux.slice(j, aux.length);
          second = second.join(" ");

          j = aux.length;
        }
      }

      var third = [first, second];
      description_arr[i] = third;
    }
  }

  var xml_full_register;
  var xml_full_register2 = "";
  for (var i = 0; i < description_arr.length; i++) {
    var xml_BitInfo;
    if (typeof description_arr[i] == "string") {
      xml_BitInfo = `
      <BitInfo>
        <bit>${bit_nr_arr[i]}</bit>
        <info>${description_arr[i]}</info>
    </BitInfo>
      `;
    } else {
      description_arr[i][0] = description_arr[i][0].slice(
        1,
        description_arr[i][0].length
      );
      description_arr[i][1] = description_arr[i][1].slice(
        1,
        description_arr[i][1].length
      );
      var str1 = `<value>0</value>
        <info>${description_arr[i][0]}</info>`;
      var str2 = `<value>1</value>
        <info>${description_arr[i][1]}</info>`;

      xml_BitInfo = `
      <BitInfo>
        <bit>${bit_nr_arr[i]}</bit>
        ${str1}
        ${str2}
    </BitInfo>
    `;
    }

    xml_full_register2 = xml_full_register2.concat(xml_BitInfo);
    // p(xml_BitInfo);
  }
  xml_full_register = `
  <Register>
  <index></index>
  ${xml_full_register2}
  </Register>
  `;

  textArea2.value = xml_full_register;
}

/****************************************/
/*Function Name: THS_register_to_XML2*/
/*USE: Converts text format Register info to XML format, to be added in the DICT.xml*/
/*The input info needs to start with the bit 15 */
/*IN: Register description from manual*/
/*OUT: The same info but in XML format*/
/***************************************/
function THS_register_to_XML2(text) {
  text = textArea1.value;
  var arr_str = text;
  arr_str = arr_str.match(/[^\n]+/gm);
  arr_str = arr_str.join(" ");
  arr_str = arr_str.match(/[^ ]+/gm);
  var final_string = ` <THS_Register>
  <index>???</index>
  <Title>???</Title>
  `;

  var aux_string = "";
  var bit_order = "15";
  var remnant_info = 0;

  for (var i = 0; i < arr_str.length; i++) {
    var NR_bits = THS_two_nums_strings_min_max(arr_str[i]);
    if (NR_bits != null) {
      //checks if the array Elem is a nr or [max,min]

      if (typeof NR_bits == "object" && NR_bits[0] == bit_order) {
        //checks if nr found is the next correct bit and is in [max ,min]---------

        if (remnant_info == 1) {
          final_string = final_string.concat(`<info>${aux_string}</info>
                </BitInfo>`);
          remnant_info = 0;
          aux_string = "";
        }

        if (arr_str[i + 1] == "Reserved") {
          //If the info is reserved
          final_string = final_string.concat(`

          <BitInfo>
                    <bit>${arr_str[i]}</bit>
                    <info>Reserved</info>
                </BitInfo>`);

          i++;
        } else {
          //If the info has 1 and 0 bits description
          for (var j = i + 1; j < arr_str.length; j++) {
            if (arr_str[j] == "0") {
              final_string = final_string.concat(`
          
                <BitInfo>
                    <bit>${arr_str[i]}</bit>
                    <info>${aux_string}</info>
                    <value>0</value>
                    `);
              aux_string = "";
            } else if (arr_str[j] == "1") {
              final_string = final_string.concat(`
              <info>${aux_string}</info>
              <value>1</value>
              `);

              aux_string = "";

              i = j + 1;
              j = arr_str.length;
              remnant_info = 1;
            } else {
              aux_string = aux_string.concat(arr_str[j]);
            }
          }
        }

        bit_order = NR_bits[1] - 1;
      } else if (NR_bits == bit_order) {
        //checks if nr found is the next correct bit------------------------

        if (remnant_info == 1) {
          final_string = final_string.concat(`<info>${aux_string}</info>
                </BitInfo>`);
          remnant_info = 0;
          aux_string = "";
        }

        if (arr_str[i + 1] == "Reserved") {
          //If the info is reserved
          final_string = final_string.concat(`
          
          <BitInfo>
                    <bit>${arr_str[i]}</bit>
                    <info>Reserved</info>
                </BitInfo>`);
          i++;
        } else {
          //If the info has 1 and 0 bits description
          for (var j = i + 1; j < arr_str.length; j++) {
            if (arr_str[j] == "0") {
              final_string = final_string.concat(`
          
                <BitInfo>
                    <bit>${arr_str[i]}</bit>
                    <info>${aux_string}</info>
                    <value>0</value>
                    `);
              aux_string = "";
            } else if (arr_str[j] == "1") {
              final_string = final_string.concat(`<info>${aux_string}</info>
                  <value>1</value>
                  `);

              aux_string = "";

              i = j + 1;
              j = arr_str.length;
              remnant_info = 1;
            } else {
              aux_string = aux_string.concat(arr_str[j] + " ");
            }
          }
        }

        bit_order = NR_bits - 1;
      }
    } else {
      aux_string = aux_string.concat(arr_str[i] + " ");
    }
  }

  final_string = final_string.concat(`<info>${aux_string}</info>
  </BitInfo>

  </THS_Register>`);

  textArea2.value = final_string;
}
