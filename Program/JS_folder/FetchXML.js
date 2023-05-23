/****************************************/
/*Function Name: LiveServerFetchXML("./DICT.xml") */
/*USE: If the program is opened with a Live Server then the DICT.xml file will be downloaded into the program */
/* and all the useful information will be read and used*/
/*USE: All_registers_g var is used to store all the CiA Registers */
/*USE: All_THS_registers_g var is used to store all the THS Registers */
/***************************************/

if (localStorage.getItem("XML_in_LS") == null) {
  localStorage.setItem("XML_in_LS", "0");
}
var DICT_XML = "";
var All_registers_g = [];
var All_THS_registers_g = [];
var All_Objects_g = [];

// LiveServerFetchXML("./DICT.xml");

function LiveServerFetchXML(xml) {
  let xmlContent = "";
  fetch(xml).then((response) => {
    response.text().then((xml) => {
      xmlContent = xml;

      let parser = new DOMParser();
      let xmlDOM = parser.parseFromString(xmlContent, "application/xml");
      All_registers_g = xmlDOM.querySelectorAll("Register");
      All_THS_registers_g = xmlDOM.querySelectorAll("THS_Register");

      //dont touch
    });
  });
  return;
}

//If the Application is opened without a live server then the user will have to input all the necesarry information--------------------------->>
setTimeout(() => {
  if (All_registers_g.length == 0) {
    //Adding the possibility to reload the XML in case some changes were done
    UserFetchXML_UI_ChooseFile_btn.addEventListener(
      "change",
      readChooseFile,
      false
    );
    if (localStorage.getItem("XML_in_LS") == 1) {
      Write2LocalStorage();
      return;
    }
    UserFetchXML_UI_mainContainer.style.display = "block";
    TOP_NAV.classList.add("ReloadXML");
  }
}, 200);

function readChooseFile(evt) {
  var f = evt.target.files[0];

  if (f) {
    //Checking if the file loaded is DICT.xml -if yes a check will appear otherwise a cross
    var aux = evt.target.value;

    if (aux.slice(aux.length - 8, aux.length) != "DICT.xml") {
      dom(".badXML").style.display = "inline";
      dom(".goodXML").style.display = "none";

      return;
    }
    dom(".badXML").style.display = "none";
    dom(".goodXML").style.display = "inline";
    var r = new FileReader();

    r.onload = function (e) {
      DICT_XML = e.target.result;
      let parser = new DOMParser();
      let xmlDOM = parser.parseFromString(DICT_XML, "application/xml");
      All_registers_g = xmlDOM.querySelectorAll("Register");
      All_THS_registers_g = xmlDOM.querySelectorAll("THS_Register");
      All_Objects_g = xmlDOM.querySelectorAll("Object");
      Write2LocalStorage();
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function Write2LocalStorage() {
  if (localStorage.getItem("XML_in_LS") == 0) {
    //Deleting the existing items in LS and setting the load input to nothing
    localStorage.clear();
    UserFetchXML_UI_ChooseFile_btn.value = "";
    localStorage.setItem("XML_in_LS", `1`);
    localStorage.setItem("DictionaryXML", `${DICT_XML}`);
  }

  var contents = localStorage.getItem("DictionaryXML");

  let parser = new DOMParser();
  let xmlDOM = parser.parseFromString(contents, "application/xml");
  All_registers_g = xmlDOM.querySelectorAll("Register");
  All_THS_registers_g = xmlDOM.querySelectorAll("THS_Register");
  All_Objects_g = xmlDOM.querySelectorAll("Object");
  UserFetchXML_UI_mainContainer.style.display = "none";
  TOP_NAV.classList.remove("ReloadXML");

  // ReloadXML_btn.style.color = "white";
}

//ReloadXML menu btn from the sideNav
ReloadXML_btn.addEventListener("click", () => {
  // TOP_NAV.classList.toggle("ReloadXML");

  if (TOP_NAV.classList.contains("ReloadXML")) {
    TOP_NAV.classList.remove("ReloadXML");
    UserFetchXML_UI_mainContainer.style.display = "none";
    // ReloadXML_btn.style.color = "white";
    localStorage.removeItem("XML_in_LS");
    localStorage.setItem("XML_in_LS", "1");
  } else {
    UserFetchXML_UI_mainContainer.style.display = "block";
    TOP_NAV.classList.add("ReloadXML");

    // ReloadXML_btn.style.color = "red";
    localStorage.removeItem("XML_in_LS");
    localStorage.setItem("XML_in_LS", "0");
  }
});
