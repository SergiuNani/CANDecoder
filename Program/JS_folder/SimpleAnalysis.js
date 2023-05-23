/***************************************/
/*1. Main Object Search bar*/
/*2. Calculator APP*/
/***************************************/

// There is a big Search Bar at the start of the program - it searches and shows all the supported onjects
function DisplayObjectTable(e) {
  if (dom("#ObjectSpace") != null) {
    dom("#ObjectSpace").remove();
  }
  const ObjectSpace = document.createElement("div");
  SearchResults4Objects.appendChild(ObjectSpace);
  ObjectSpace.setAttribute("id", "ObjectSpace");
  //loop

  for (var j = 0; j < All_Objects_g.length; j++) {
    if (
      All_Objects_g[j].children[0].innerHTML
        .toUpperCase()
        .indexOf(e.target.value.toUpperCase()) > -1 ||
      All_Objects_g[j].children[1].innerHTML
        .toUpperCase()
        .indexOf(e.target.value.toUpperCase()) > -1
    ) {
      var objectDiv = document.createElement("div");
      ObjectSpace.append(objectDiv);
      objectDiv.classList.add("objectCard");
      var aux_index = All_Objects_g[j].children[0].innerHTML;
      aux_index = aux_index.slice(2, 10);
      var aux_title = All_Objects_g[j].children[1].innerHTML;
      var aux_size = All_Objects_g[j].querySelector("BitSize").innerHTML;
      objectDiv.innerHTML = `<span class="OS_index">${aux_index}h</span> - <span class="OS_title">${aux_title}</span> - <span class="OS_size">${aux_size}bits</span>`;
      if (All_Objects_g[j].querySelectorAll("SubItem").length != 0) {
        const extraItemsSpace = document.createElement("div");
        extraItemsSpace.classList.add("extraItemsSpace");
        objectDiv.appendChild(extraItemsSpace);
        for (
          var i = 0;
          i < All_Objects_g[j].querySelectorAll("SubItem").length;
          i++
        ) {
          var objectDiv_subItem = document.createElement("div");

          extraItemsSpace.append(objectDiv_subItem);
          objectDiv_subItem.classList.add("objectCard_subitem");
          var aux_index = "TBD";
          if (
            All_Objects_g[j]
              .querySelectorAll("SubItem")
              [i].querySelector("Index") != null
          ) {
            aux_index = All_Objects_g[j]
              .querySelectorAll("SubItem")
              [i].querySelector("Index").innerHTML;
            aux_index = aux_index.slice(2, 10);
          }
          var aux_title = All_Objects_g[j]
            .querySelectorAll("SubItem")
            [i].querySelector("Name").innerHTML;
          var aux_size = "0";
          if (
            All_Objects_g[j]
              .querySelectorAll("SubItem")
              [i].querySelector("BitSize") != null
          ) {
            var aux_size = All_Objects_g[j]
              .querySelectorAll("SubItem")
              [i].querySelector("BitSize").innerHTML;
          }
          objectDiv_subItem.innerHTML = `<span class="OS_index">${aux_index}h</span> - <span class="OS_title">${aux_title}</span> - <span class="OS_size">${aux_size}bits</span>`;
        }
      }
    }
  }
}

/***************************************/
/*CALCULATOR APP*/
/***************************************/

function DrawEveryBit4Caclulator(hex_input) {
  //removing the previous elements
  if (dom("#bitsSpace_PC") != null) {
    dom("#bitsSpace_PC").remove();
  }

  var bits_value = hex2bin(hex_input, 32);
  var bits_value_higher = bits_value.slice(0, 16);
  bits_value_higher = bits_value_higher.split("");

  var bits_value_lower = bits_value.slice(16, 32);
  bits_value_lower = bits_value_lower.split("");

  const bitsSpace_PC = document.createElement("div");
  bitsSpace_PC.setAttribute("id", "bitsSpace_PC");
  CalculatorAPP_body.appendChild(bitsSpace_PC);

  const firstRowPC = document.createElement("div");
  firstRowPC.setAttribute("id", "firstRowPC");
  const secondRowPC = document.createElement("div");
  secondRowPC.setAttribute("id", "secondRowPC");
  bitsSpace_PC.append(firstRowPC, secondRowPC);

  bits_value_higher.forEach((el, index) => {
    var oneBitSquarePC = document.createElement("p");
    firstRowPC.append(oneBitSquarePC);
    oneBitSquarePC.classList.add("oneBitSquarePC");
    oneBitSquarePC.innerText = el;
    if ((index + 1) % 4 == 0) {
      oneBitSquarePC.classList.add("spaceBetween_PC");
    }
  });
  bits_value_lower.forEach((el, index) => {
    var oneBitSquarePC = document.createElement("p");
    secondRowPC.append(oneBitSquarePC);
    oneBitSquarePC.classList.add("oneBitSquarePC");
    oneBitSquarePC.innerText = el;
    if ((index + 1) % 4 == 0) {
      oneBitSquarePC.classList.add("spaceBetween_PC");
    }
  });
  DrawingBitsNrPC();
  var all_bits_PC = CalculatorAPP_body.querySelectorAll(".oneBitSquarePC");
  all_bits_PC.forEach((bit) => {
    bit.addEventListener("click", (e) => {
      if (e.target.innerText == 1) {
        e.target.innerText = 0;
      } else {
        e.target.innerText = 1;
      }
      UpdatePC();
    });
  });

  UpdatePC();
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function DrawingBitsNrPC() {
  const firstRowBits = document.createElement("div");
  firstRowBits.setAttribute("id", "firstRowBits");
  const secondRowBits = document.createElement("div");
  secondRowBits.setAttribute("id", "secondRowBits");
  bitsSpace_PC.insertBefore(firstRowBits, secondRowPC);
  insertAfter(secondRowBits, secondRowPC);
  var inc = 0;
  for (var i = 0; i < 16; i++) {
    var oneBitOrder = document.createElement("p");
    var oneBitOrder2 = document.createElement("p");
    firstRowBits.append(oneBitOrder);
    secondRowBits.append(oneBitOrder2);
    oneBitOrder.classList.add("oneBitOrder");
    oneBitOrder2.classList.add("oneBitOrder");
    oneBitOrder.innerText = 31 - inc++;
    oneBitOrder2.innerText = 16 - inc;
    if (inc % 4 != 0) {
      oneBitOrder.classList.add("hidden");
      oneBitOrder2.classList.add("hidden");
    } else {
      oneBitOrder.classList.add("spaceBetween_PC");
      oneBitOrder2.classList.add("spaceBetween_PC");
    }
  }
}

function UpdatePC() {
  var all_bits_PC = CalculatorAPP_body.querySelectorAll(".oneBitSquarePC");
  var valueBin = "";
  all_bits_PC.forEach((bit) => {
    valueBin = valueBin.concat(bit.innerText);
    if (bit.innerText == "1") {
      // bit.style.color = "var(--color-danger)";
      bit.classList.add("oneBitSquarePC_danger");
    } else {
      bit.classList.remove("oneBitSquarePC_danger");
      // bit.style.color = "var(--color-dark)";
    }
  });

  if (CalculatorAPP_mainDomain.classList.contains("dword_calc")) {
    var valueHex = bin2hex(valueBin);
    var valueDec = hexToDec(valueHex, 32);
  } else {
    valueBin = valueBin.slice(16, 32);
    var valueHex = bin2hex(valueBin);
    var valueDec = hexToDec(valueHex, 16);
  }
  CalculatorAPP_dec.value = valueDec;
  CalculatorAPP_hex.value = valueHex;
  CalculatorAPP_display.innerText = valueHex;
}

// Decimal field - on change the value will be recalculated
CalculatorAPP_dec.addEventListener("keyup", () => {
  var value_hex = "";
  if (CalculatorAPP_dec.value == "0-") {
    CalculatorAPP_dec.value = "-";
  }
  if (CalculatorAPP_mainDomain.classList.contains("dword_calc")) {
    CalculatorAPP_dec.value = check_validity_decimal(
      CalculatorAPP_dec.value,
      32
    );
    value_hex = decToHex(CalculatorAPP_dec.value, 32);
  } else {
    CalculatorAPP_dec.value = check_validity_decimal(
      CalculatorAPP_dec.value,
      16
    );
    value_hex = decToHex(CalculatorAPP_dec.value, 16);
  }

  if (CalculatorAPP_dec.value == "-") {
    return;
  }
  DrawEveryBit4Caclulator(value_hex);
  CalculatorAPP_display.innerText = CalculatorAPP_dec.value;
});

// Hexadecimal field - on change the value will be recalculated
CalculatorAPP_hex.addEventListener("keyup", () => {
  var value_dec = "";
  if (CalculatorAPP_mainDomain.classList.contains("dword_calc")) {
    CalculatorAPP_hex.value = check_validity_hex(CalculatorAPP_hex.value, 32);
    value_dec = hexToDec(CalculatorAPP_hex.value, 32);
  } else {
    CalculatorAPP_hex.value = check_validity_hex(CalculatorAPP_hex.value, 16);
    value_dec = hexToDec(CalculatorAPP_hex.value, 16);
  }
  if (CalculatorAPP_hex.value == "") {
    CalculatorAPP_hex.value = 0;
  }
  DrawEveryBit4Caclulator(CalculatorAPP_hex.value);
});
