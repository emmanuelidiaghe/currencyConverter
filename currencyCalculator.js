/******************************************************************************************************************************
 * ****************************************************************************************************************************
 * Author:         Emmanuel Idiaghe
 * Date Started:   September 26, 2020
 * Date Completed: September 29, 2020
 * Description:  * This is a simple web-based currency converter that converts between currencies of any two of
 *                 the countries listed in the table. The converter was first designed for manual computations by
 *                 matching properties of an object but was later upgraded to using third-party API which allows
 *                 for real-time exchange rates.
 *               * Users may add new countries, currency and currency notation and these will be updated on the table
 *                 and radio buttons appropriately.
 *               * The converter uses the currency ISO code entered by the user to obtain exchange rates, therefore, 
 *                 users should ensure that only correct data is entered in the input fields as they cannot be changed
 *                 or deleted after submission; hence, the prompt to enter "Y" or "y" to confirm or "N" or "n" to abort submission.
 * ***************************************************************************************************************************
 *****************************************************************************************************************************/

//Variable Declarations
let checkedBtnFrom  = "",
    checkedBtnTo    = "",
    amountRegex     = /^[1-9]+[0-9]*$/,
    currencyRegex   = /^[A-Z]{3}$/,
    showDiv         = document.getElementById("add"),
    input           = document.getElementById("input"),
    addBtn          = document.getElementById("addBtn"),
    output          = document.getElementById("output"),
    showBtn         = document.getElementById("showBtn"),
    inOutput        = document.getElementById("inOutput"),
    cancelBtn       = document.getElementById("cancelBtn"),
    errorSpan       = document.getElementById("errorSpan"),
    calculateBtn    = document.getElementById("calculateBtn"),
    countryinput    = document.getElementById("countryinput"),
    radio           = document.querySelectorAll(".radio-font"),
    currencyTable   = document.getElementById("currencyTable"),
    currencyInput   = document.getElementById("currencyInput"),
    currencyAbInput = document.getElementById("currencyAbInput"),
    showBottom      = (document.scrollingElement || document.body);

//Object of exchange rates (ineffective for scalability)
/*var currencyMatch = {'NGN': {'ZMW': 0.052,  'GBP': 0.0021, 'USD': 0.0026},
                       'ZMW': {'NGN': 19.06,  'GBP': 0.039,  'USD': 0.05},
                       'GBP': {'NGN': 484.95, 'ZMW': 25.44,  'USD': 1.27},
                       'USD': {'NGN': 380.5,  'ZMW': 19.97,  'GBP': 0.78}
}*/
function show() { //show fieldset for adding currencies
    showDiv.style.display = "block";
    showBottom.scrollTop = showBottom.scrollHeight;
}

function hide() { //hide fieldset for adding currencies
    showDiv.style.display = "none";
}

function buttonCheck() { //check which radio buttons were selected
    const currencyFrom = document.querySelectorAll('input[name=currencyFrom]');
    const currencyTo   = document.querySelectorAll('input[name=currencyTo]');
    for (const indexfrom of currencyFrom) {
        if (indexfrom.checked) {
            checkedBtnFrom = indexfrom.value;
            break;
        }
    }
    for (const indexTo of currencyTo) {
        if (indexTo.checked) {
            checkedBtnTo = indexTo.value;
            break;
        }
    }
}

function addTable() { //add to table and radio buttons
    if (currencyAbInput.value == "" ) 
        alert("The currency code field is mandatory!");

    else if ((!currencyAbInput.value == "" ) && (!currencyAbInput.value.match(currencyRegex))) //ensure strict usage of ISO Code
        alert("Enter only 3 capital letters as currency code");

    else {
            var promptUser = prompt("Please ensure the data entered is accurate, as changes cannot be made after submission. Enter Y to confirm or N to abort");
            var confirm = ["Y", "y", "N", "n"];
            
            function confirmAdd(user) { //ensure user really intends to add currencies
                if (user == confirm[0] || user == confirm[1]) {
                    alert("Your entries have been updated!");
                    var row = currencyTable.insertRow(-1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.innerHTML = countryinput.value;
                    cell2.innerHTML = currencyInput.value;
                    cell3.innerHTML = currencyAbInput.value;
                    for (let i = 0; i < radio.length; i++) {
                        var node  = document.createElement("INPUT");
                        var label = document.createElement("LABEL");
                        var br    = document.createElement("BR");
                        var text  = document.createTextNode(currencyAbInput.value);
                        label.appendChild(text);
                        node.setAttribute("class", "input-radio");
                        node.setAttribute("type", "radio");
                        node.setAttribute("value", currencyAbInput.value);
                        if(i == 0) node.setAttribute("name", "currencyFrom");
                        if(i == 1) node.setAttribute("name", "currencyTo");
                        radio[i].appendChild(node);
                        radio[i].appendChild(label);
                        radio[i].appendChild(br);
                    }
                }
                else if(user == confirm[2] || user == confirm[3]) {
                    alert("Your entries have been aborted!");
                }
                else alert("Please make a valid selectiton!");
            }
            confirmAdd(promptUser);
            countryinput.value = ""; //clear the fields
            currencyInput.value = "";
            currencyAbInput.value = "";
            hide();
        }
}

function convert(event) { //convert between currencies
    event.preventDefault(); //prevent submitting the form which refreshes the page
    buttonCheck();
    if (input.value == "") {
        errorSpan.innerHTML = "Please enter an amount";
    }
    else if (!(input.value == "") && (!input.value.match(amountRegex))) { //already handled by HTML5
        errorSpan.innerHTML = "Please enter a positive integer";
    }
    else errorSpan.innerHTML = "";

    if (checkedBtnFrom == checkedBtnTo) {
        output.innerHTML = input.value + " " + checkedBtnTo;
        inOutput.innerHTML = input.value + " " + checkedBtnFrom;
    }
    else {
        const fromCurrency = checkedBtnFrom;
        const toCurrency = checkedBtnTo;
        fetch('https://openexchangerates.org/api/latest.json?app_id=8d2d8cbeedb24a2e8aab28871e38fb6b').then(res => res.json())
        .then(res => {
            const rateTo = res.rates[toCurrency];
            const rateFrom = res.rates[fromCurrency];
            const rate = (rateTo/rateFrom);
            const result = (input.value * rate).toFixed(4).toString(); 
            inOutput.innerHTML = (input.value + " " + fromCurrency);
            output.innerHTML = (result + " " + toCurrency);
        })
    }
}

//Event Listeners
showBtn.addEventListener("click", show);
cancelBtn.addEventListener("click", hide);
addBtn.addEventListener("click", addTable);
calculateBtn.addEventListener("click", convert);
