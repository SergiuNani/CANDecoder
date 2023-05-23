document.addEventListener("DOMContentLoaded", (e) => {
  QuickConvertionUpdate(e);
});

/****************************************/
/*Function What happens when the ALT+SHIFT+CTRL+A keyboard shortcut is pressed*/
/*USE1: Globally used shortcut to give the possibility to switch working with DEC or Hex values for Registers*/
/****************************************/
var CalcDecimal_g = 0;
document.addEventListener("keyup", (e) => {
  //==== Shortcut for RegisterMODAL to work with DEC units as well
  if ((e.key == "A" || e.key == "a") && e.altKey && e.ctrlKey && e.shiftKey) {
    /*Adding the possibility to Draw a register with a decimal value*/
    //A global flag telling if the Register will show the Value in DEC or HEX
    if (CalcDecimal_g == 0) {
      CalcDecimal_g = 1;
    } else {
      CalcDecimal_g = 0;
    }
    //Deleting the option to draw reg with DEC values
    var no_modals = RegisterModal.querySelectorAll(".DEC");
    if (no_modals.length) {
      no_modals.forEach((modal) => {
        modal.classList.remove("DEC");
        modal.placeholder = "Hex";
      });
    }
    //Adding the DEC class to the existing elements
    no_modals = RegisterModal.querySelectorAll(".RM_single");
    if (CalcDecimal_g == 1) {
      no_modals.forEach((modal) => {
        modal.children[0].children[1].children[2].classList.add("DEC");
        modal.children[0].children[1].children[2].placeholder = "DEC";
      });
    }
    //Dont Delete
  }
  //========If the Escape key is pressed===============//
  if (e.key == "Escape") {
    //Collapsing all the lists of options that has been extended on the DOM
    var all_opened_dropdowns = document.querySelectorAll(".dropdown_g.active");
    all_opened_dropdowns.forEach((list) => {
      list.classList.remove("active");
    });

    //Deleting the FactorGroupPreferencesUI
    dom("body").classList.remove("open_UserSettings_UI");
    //Deleting the CalcApp
    dom("body").classList.remove("Calculator_appeared");

    //Deleting all the errors
    var all_ErrorModals = document.querySelectorAll(".errorModal ");
    all_ErrorModals.forEach((modal) => {
      modal.classList.add("hide");
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    //Removing the Register Modals

    TOP_NAV.classList.remove("extentedRegisterModal");

    //CLosing OVERVIEW
    dom("body").classList.toggle("A3_Overview_appeared");

    //Removing HELP
    //bug -> toggle to remove
    // dom("body").classList.toggle("HELP_extended");
  }
  //=====In Compose a MSG UI - if ENTER then the message will be drawn in the table
  if (
    dom("body").classList.contains("A1_ComposeCANmsgs_UI_appeared") &&
    !TOP_NAV.classList.contains("extentedRegisterModal")
  ) {
    if (e.key == "Enter") {
      DrawCodedMessage();
    }
  }
  //=====In PDO detected UI - if ENTER then the objects will be mapped

  if (!PDO_detected_main_UI.classList.contains("none")) {
    if (e.key == "Enter") {
      var Error = Check4Errors_pdo_user_selection();
      if (Error == "Error") {
        return;
      }
      PDO_MAP();
    }
  }

  if (dom("body").classList.contains("A2_DecodeOneMsg_UI_appeared")) {
    if (e.key == "Enter") {
      if (
        A2_COB_ID_field_flyingModal != document.activeElement &&
        A2_DATA_field_flyingModal != document.activeElement
      ) {
        DrawOneMsg(e);
      }
    }
  }

  //==== ALT+1 - opens FG preferences
  if (e.altKey && e.key == "1") {
    dom("body").classList.toggle("open_UserSettings_UI");
  }
  //==== CTRL+1 - opens FG preferences
  if (e.ctrlKey && e.key == "0") {
    document.body.classList.toggle("dark-theme-variables");
  }
});

//DARK mode vs LIGHT mode toggle
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  if (themeToggler.children[0].classList.contains("active")) {
    themeToggler.children[0].classList.remove("active");
    themeToggler.children[1].classList.add("active");
  } else {
    themeToggler.children[1].classList.remove("active");
    themeToggler.children[0].classList.add("active");
  }
});

// Extend the Sidebar
extendSidebar_btn.addEventListener("click", () => {
  dom("body").classList.toggle("sidebarExtended");
});

// =============== OPEN the HELP menu
HELP_menu_btn.addEventListener("click", () => {
  dom("body").classList.toggle("HELP_extended");
});
//CLOSE the HELP menu
HELP_close_btn.addEventListener("click", () => {
  dom("body").classList.toggle("HELP_extended");
});

// =============== Open the Calculator
CalculatorAPP_btn.addEventListener("click", () => {
  dom("body").classList.toggle("Calculator_appeared");
  //If the btn is pressed then the program will calculate the zero value after 100ms - because of async coding
  if (dom("body").classList.contains("Calculator_appeared")) {
    setTimeout(() => {
      DrawEveryBit4Caclulator("0000");
    }, 100);
  }
});

// Close the Calculator
CalculatorApp_close_btn.addEventListener("click", () => {
  dom("body").classList.toggle("Calculator_appeared");
});

// CALC APP - option to change from WORD to DWORD
CalculatorAPP_word_dword.addEventListener("click", () => {
  CalculatorAPP_mainDomain.classList.toggle("dword_calc");
  DrawEveryBit4Caclulator(CalculatorAPP_hex.value);
});

// =============== Object Search bar
SearchObjectsInputBar.addEventListener("focus", (e) => {
  dom("#CAN_DECODER_BODY_container").classList.toggle(
    "SearchObjectsInputBar_focused"
  );
  DisplayObjectTable(e);
  window.scrollTo(0, 0);
});
SearchObjectsInputBar.addEventListener("blur", () => {
  dom("#CAN_DECODER_BODY_container").classList.toggle(
    "SearchObjectsInputBar_focused"
  );
  while (ObjectSpace.children.length) {
    ObjectSpace.children[0].remove();
  }
});
SearchObjectsInputBar.addEventListener("keyup", DisplayObjectTable);

/*-----------------------------------------------------------**/
/*DrawOneMsg*/
/*-----------------------------------------------------------**/

A2_OneMsg_UI_btn.addEventListener("click", () => {
  dom("body").classList.toggle("A2_DecodeOneMsg_UI_appeared");
});
// Close the Decode IU modal
simpleCANmsg_close_btn.addEventListener("click", () => {
  dom("body").classList.toggle("A2_DecodeOneMsg_UI_appeared");
});

A2_COB_ID_field_flyingModal.addEventListener("keyup", DrawOneMsg);
A2_DATA_field_flyingModal.addEventListener("keyup", (e) => {
  var aux = check_validity_hex(A2_DATA_field_flyingModal.value, 64);
  if (aux == "") {
    A2_DATA_field_flyingModal.value = aux;
    ErrorModal("Data field is empty");
    return;
  }

  DrawOneMsg(e);
});

A2_COB_ID_field_flyingModal.addEventListener("input", () => {
  A2_COB_ID_field_flyingModal.value = check_validity_hex(
    A2_COB_ID_field_flyingModal.value,
    16
  );
  if (A2_COB_ID_field_flyingModal.value.length > 3) {
    A2_COB_ID_field_flyingModal.value = A2_COB_ID_field_flyingModal.value.slice(
      0,
      3
    );
  }
});

/*-----------------------------------------------------------*/
/*PDO has been Detected*/
/*-----------------------------------------------------------*/

PDO_detect_obj1.addEventListener("input", () => {
  PDO_detect_obj1.value = check_validity_hex(PDO_detect_obj1.value, 16);
});

PDO_detect_obj2.addEventListener("input", () => {
  PDO_detect_obj2.value = check_validity_hex(PDO_detect_obj2.value, 16);
});

PDO_detect_obj3.addEventListener("input", () => {
  PDO_detect_obj3.value = check_validity_hex(PDO_detect_obj3.value, 16);
});

PDO_detect_obj4.addEventListener("input", () => {
  PDO_detect_obj4.value = check_validity_hex(PDO_detect_obj4.value, 16);
});

PDO_detect_obj_subindex_1.addEventListener("input", () => {
  PDO_detect_obj_subindex_1.value = check_validity_hex(
    PDO_detect_obj_subindex_1.value,
    8
  );
});

PDO_detect_obj_subindex_2.addEventListener("input", () => {
  PDO_detect_obj_subindex_2.value = check_validity_hex(
    PDO_detect_obj_subindex_2.value,
    8
  );
});

PDO_detect_obj_subindex_3.addEventListener("input", () => {
  PDO_detect_obj_subindex_3.value = check_validity_hex(
    PDO_detect_obj_subindex_3.value,
    8
  );
});

PDO_detect_obj_subindex_4.addEventListener("input", () => {
  PDO_detect_obj_subindex_4.value = check_validity_hex(
    PDO_detect_obj_subindex_4.value,
    8
  );
});

PDO_detected_options_menu.addEventListener("change", () => {
  PDO_detected_MenuToggle();
});

applyBtn_PDO_detected_UI.addEventListener("click", () => {
  var Error = Check4Errors_pdo_user_selection();
  if (Error == "Error") {
    return;
  }
  PDO_MAP();
});

/*-----------------------------------------------------------*/
/*Extra*/
/*-----------------------------------------------------------*/

/**DEBUG MENU***********************/

Debug_btn.addEventListener("click", (e) => {
  p("Debug ON______________________");

  // for (var i = 0; i < AllMsgsDecoded_Array_g.length; i++) {
  //   var main_row = document.createElement("div");
  //   var raw_row = document.createElement("div");
  //   var decoded_row = document.createElement("div");
  //   main_row.append(raw_row, decoded_row);
  //   raw_row.classList.add("t1");
  //   main_row.classList.add("t2");
  //   raw_row.innerText = AllMsgRAW[i];
  //   footer.appendChild(main_row);

  //   for (var j = 0; j < AllMsgsDecoded_Array_g[i].length; j++) {
  //     var p_elem = document.createElement("p");
  //     p_elem.innerHTML = AllMsgsDecoded_Array_g[i][j];
  //     p_elem.classList.add("text_show_1");

  //     decoded_row.appendChild(p_elem);
  //   }
  // }

  // var parent = document.createElement("div");
  // for (var i = 0; i < AllMsgsExtracted_Array_g.length; i++) {
  //   pp(45);
  //   var raw_row = document.createElement("div");

  //   raw_row.innerText = AllMsgsExtracted_Array_g[i];
  //   parent.appendChild(raw_row);
  // }
  // footer.appendChild(parent);

  pp("Unknown_Msgs_counter: " + Unknown_Msgs_counter);
  pp("AllAxis_Msgs_NMT: " + AllAxis_Msgs_NMT);
  pp("AllAxis_Msgs_sync: " + AllAxis_Msgs_sync);
  pp("AllAxis_Msgs_TCAN: " + AllAxis_Msgs_TCAN);

  pp("Available_Axes_perCANupload: " + Available_Axes_perCANupload);

  //CALCULATING ALL THE MESSAGES DISTRIBUTION
  var sum = 0;
  for (var j = 0; j < Available_Axes_perCANupload.length; j++) {
    //Not counting the last nr because there will be all the errors
    for (
      var k = 0;
      k <
      window[`statistics_AXIS_${Available_Axes_perCANupload[j]}`].length - 1;
      k++
    ) {
      sum += window[`statistics_AXIS_${Available_Axes_perCANupload[j]}`][k];
    }
  }
  sum +=
    Unknown_Msgs_counter +
    AllAxis_Msgs_NMT +
    AllAxis_Msgs_sync +
    AllAxis_Msgs_TCAN;

  pp("ALL MESSAGES NR: " + sum);
});
// CreatePdoDetectedWindow("504", "0600 06");
