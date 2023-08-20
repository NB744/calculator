window.onload = function(){
    console.log("Welcome to Nischal B's Calculator!");

    //First, when the DOM is loaded, we create a calculator object.
    let calculator = {
        'firstOperand': 0,
    };
    console.log(calculator);

    //Event listener for any button press.
    document.querySelectorAll(".calculator-btn").forEach(element => {
        element.addEventListener("click", () =>{
            console.log(element);
            //Get the value of the button.
            let clickedBtnVal = element.textContent;
            let clickedBtnType = element.getAttribute("data-btn-type");
            console.log(clickedBtnVal);
            console.log(clickedBtnType);
            //Now, let's add this value to our calculator object.
            processBtnClick(clickedBtnVal, clickedBtnType);
        });
        //console.log(element);

    });

    function processBtnClick(btnVal, btnType){
        /**
         * To process a button click into our calculator object,
         * we follow a few steps:
         * 
         *      1. See if this is a operator or a operand.
         *      2. If Operator:
         *          a. Add it to the "currentOperator" property of our calculator object.
         *      3. If Operand:
         *          a. If "currentOperator" propery of our calculator object exists:
         *              i. Add operand to the "secondOperand" property.
         *              ii. Perform operation using the operators and the operands.
         *          b. If "currentOperator" property of our calculator object doesn't exist:
         *              i. Concatenate the operand to the "firstOperand" property and update the property.
        */
        console.log(calculator);
        if(btnType === "opt"){
            //The button clicked was a operator. Let's add it to our "currenOperator" property.
            calculator.currentOperator = btnVal;
        }else if (btnType === "opr"){
            //The button clicked was a operand.
            //See if the currentOperator property exists in the calculator object.
            if("currentOperator" in calculator){
                //Operator exists.
                //Add this operand to our object's "secondOperand" property.
                if("secondOperand" in calculator){
                    calculator.secondOperand = `${calculator.secondOperand}${btnVal}`;
                }else{
                    //Simply set the value to be the secondOperand.
                    calculator.secondOperand = btnVal;
                    //SpecialCase: If the "decimal" button is clicked, we add "0." instead of simply "."
                    if(btnVal === "."){
                        calculator.secondOperand = "0.";
                    }
                }
                
                //Now, perform calculation based on the operator.

            }else{
                //Operator doesn't exist.
                //Get the "firstOperand" property from the calculator object and concatenate this value.
                //calculator.firstOperand = parseInt(`${calculator.firstOperand}${parseInt(btnVal)}`);
                calculator.firstOperand = `${calculator.firstOperand}${btnVal}`;
            }
        }else if(btnType === "other"){

        }

        console.log(calculator);
        

    }
    

}