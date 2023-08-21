window.onload = function(){

    // First, when the DOM is loaded, we create a calculator object.
    let calculator = {
        'firstOperand': 0,
    };
    let errorDisplayed = false;
    displayResult(0);

    // Event listener for any button press.
    document.querySelectorAll(".calculator-btn").forEach(element => {
        element.addEventListener("click", () =>{
            errorDisplayed = false;
            // Get the value of the button.
            let clickedBtnVal = element.textContent;
            let clickedBtnType = element.getAttribute("data-btn-type");
            // Now, let's add this value to our calculator object.
            processBtnClick(clickedBtnVal, clickedBtnType);
        });

    });

    function processBtnClick(btnVal, btnType){
        /**
         * To process a button click into our calculator object,
         * we follow a few steps:
         * 
         *      1. See if this is a operator or a operand.
         *      2. If Operator:
         *          a. If all "firstOperand", "secondOperand", and "currentOperator" already exist:
         *              i. Perform the operation and store the computed value as the new "firstOperand"
         *              ii. Delete the secondOperand & continue to step b.
         *          b. Add the operator to the "currentOperator" property of our calculator object.
         *      3. If Operand:
         *          a. If "currentOperator" propery of our calculator object exists:
         *              i. Add operand to the "secondOperand" property.
         *          b. If "currentOperator" property of our calculator object doesn't exist:
         *              i. Concatenate the operand to the "firstOperand" property and update the property.
        */
       
        if(btnType === "opt"){
            // First, check to see if both operands and the operator already exists in the calculator object. 
            // If so, we need to perform that operation and store the computed value in the "firstOperand" property.
            if(("firstOperand" in calculator) && ("secondOperand" in calculator) && ("currentOperator" in calculator)){
                // Let's perform the calculation.
                let operationVal = performOperation();
                //Now, store this value in the "firstOperand" property.
                calculator.firstOperand = operationVal;
                //Now, delete the "secondOperand" property.
                delete calculator.secondOperand;
            }
            // The button clicked was a operator. Let's add it to our "currenOperator" property.
            // Only add it if there was no error was displayed on the last computation. (errorDisplayed) value.
            if(!errorDisplayed){
                calculator.currentOperator = btnVal;
                // Also, display the current calculation string.
                displayCalculation();
            }
        }else if (btnType === "opr"){
            
            // The button clicked was a operand.
            // See if the currentOperator property exists in the calculator object.
            if("currentOperator" in calculator){
                // Operator exists.
                // Add this operand to our object's "secondOperand" property.
                if("secondOperand" in calculator){
                    // See what the last digit of "secondOperand" is. 
                    // If it is alreay ".", and the user clicked on "." again, we don't want to add another "." to the operand.
                    if(!(btnVal === "." && (calculator.secondOperand.slice(-1) === "."))){
                        calculator.secondOperand = `${calculator.secondOperand}${btnVal}`;
                    }
                }else{
                    // Simply set the value to be the secondOperand.
                    calculator.secondOperand = btnVal;
                    // SpecialCase: If the "decimal" button is clicked, we add "0." instead of simply "."
                    if(btnVal === "."){
                        calculator.secondOperand = "0.";
                    }
                }
                // Display this operand in the calculator result screen.
                displayResult(calculator.secondOperand);
                // Now, perform calculation based on the operator.

            }else{
                // Operator doesn't exist.
                // Get the "firstOperand" property from the calculator object and concatenate this value.
                // calculator.firstOperand = parseInt(`${calculator.firstOperand}${parseInt(btnVal)}`);
                if(calculator.firstOperand === 0){
                    calculator.firstOperand = btnVal;
                }else{
                    // See what the last digit of "firstOperand" is. 
                    // If it is alreay ".", and the user clicked on "." again, we don't want to add another "." to the operand.
                    if(!(btnVal === "." && (calculator.firstOperand.slice(-1) === "."))){
                        calculator.firstOperand = `${calculator.firstOperand}${btnVal}`;
                    }
                    
                    
                }
                
                // Display this operand in the calculator result screen.
                displayResult(calculator.firstOperand);
            }
            
        }else if(btnType === "other"){
            if(btnVal === "AC"){
                // Reset the calculator.
                resetCalculator();
            }
            if(btnVal === "DEL"){
                if("secondOperand" in calculator){
                    // Remove the last digit from the "secondOperand". If it's a single digit, delete the second Operand completely.
                    calculator.secondOperand = (calculator.secondOperand).substr(0, calculator.secondOperand.length - 1);
                    // Now, after removing the last digit, if the "secondOperand" is "", we delete this property completely.
                    if(calculator.secondOperand === "" || calculator.secondOperand === "-"){
                        delete calculator.secondOperand;
                    }

                    // Now, update the result display since we deleted the last digit.
                    displayResult(calculator.secondOperand);
                    //Also, update calculation display.
                    displayCalculation();
                    
                }else{
                    if("currentOperator" in calculator){
                        // This means the user clicked delete after pressing one of the operator. 
                        // In this case, we will delete the last operator and bring back the first operator in result screen.
                        delete calculator.currentOperator;
                        // Now, display the first operand in the result screen.
                        displayResult(calculator.firstOperand);
                        // Also, clear the calculation display.
                        displayCalculation("reset");

                    }else{
                        // This means we only have the "firstOperand" in our calculator object. 
                        // We simply delete the last digit from it, and update the result display.
                        calculator.firstOperand = (calculator.firstOperand).substr(0, (calculator.firstOperand).length - 1);
                        
                        if(calculator.firstOperand === "" || calculator.firstOperand === "-"){
                            resetCalculator();
                        }
                        // Now, update the result display since we deleted the last digit.
                        displayResult(calculator.firstOperand);
                    }
                    
                }
            }
            if(btnVal === "+/-"){
                // See if we have "secondOperand" in the calculator object.
                if("secondOperand" in calculator){
                    // This means we have the secondOperand value in our calculator.
                    // Check if it is currently positive or negative.
                    // If positive, change it to negative.
                    // If negative, change it to positive.
                    if(calculator.secondOperand > 0){
                        // This means the operand is positive currently. Let's change it to negative.
                        calculator.secondOperand = `-${calculator.secondOperand}`;
                    }else{
                        // This means the operand is negative currently. Let's change it to positive.
                        // We simply remove the first digit since it is the "-" sign.
                        calculator.secondOperand = calculator.secondOperand.substr(1);
                    }
                    // Now, update the result display.
                    displayResult(calculator.secondOperand);
                }else{
                    // There is no "secondOperand" in our calculator. Now, let's check and see if there is "currentOperator".
                    // If there is, then we do nothing since +/- doesn't work on our operators. It only works on operands.
                    if("currentOperator" in calculator){
                        //Do nothing.
                    }else{
                        //This means there is no "secondOperand" and there is no "currentOperator". We only have "firstOperand".
                        // We check to see if the "firstOperand" is positive or negative currently.
                        // If positive, change it to negative.
                        // If negative, change it to positive.
                        if(calculator.firstOperand > 0){
                            // This means the operand is positive currently. Let's change it to negative.
                            calculator.firstOperand = `-${calculator.firstOperand}`;
                        }else{
                            // This means the operand is negative currently. Let's change it to positive.
                            // We simply remove the first digit since it is the "-" sign.
                            calculator.firstOperand = calculator.firstOperand.substr(1);
                        }
                        // Now, update the result display.
                        displayResult(calculator.firstOperand);
                    }
                }
            }
            if(btnVal === "="){
                // This means the user pressed the "=" button. We simply perform the calculation and display the result.
                // However, this should only work when there is "firstOperand", "secondOperand", and also the "currentOperator" property in our calculator object.
                if(("firstOperand" in calculator) && ("currentOperator" in calculator) && ("secondOperand" in calculator)){
                    //Update Calculate String.
                    displayCalculation("equals");
                    // Perform calculation.
                    let equalsValue = performOperation();
                    //Now, set this total as the new firstOperand. Also, delete the "secondOperand" and the "currentOperator"
                    calculator.firstOperand = `${equalsValue}`;
                    delete calculator.currentOperator;
                    delete calculator.secondOperand;
                }
            }
        }
        //console.log(calculator);
    }

    /**
     * Function to call appropriate operation functions based on the calculator object properties.
     * 
     */
    function performOperation(){
        let currentOperationType = calculator.currentOperator;
        let operationResult;

        if(currentOperationType === "+"){
            operationResult = performAddition(calculator.firstOperand, calculator.secondOperand);
        }
        if(currentOperationType === "-"){
            operationResult = performSubstraction(calculator.firstOperand, calculator.secondOperand);
        }
        if(currentOperationType === "X"){
            operationResult = performMultiplication(calculator.firstOperand, calculator.secondOperand);
        }
        if(currentOperationType === "÷"){
            operationResult =  performDivision(calculator.firstOperand, calculator.secondOperand);
        }
        if(currentOperationType === "^"){
            operationResult =  performExponentiation(calculator.firstOperand, calculator.secondOperand);
        }
        // Display result.
        displayResult(operationResult);
        if(operationResult === "Error!"){
            resetCalculator();
            return 0;
        }
        return operationResult;
    }

    /**
     * Function to perform addition between 2 values.
     * 
     */
    function performAddition(a,b){
        return parseFloat(a) + parseFloat(b);
    }

    /**
     * Function to perform substraction between 2 values.
     * 
     */
    function performSubstraction(a,b){
        return parseFloat(a) - parseFloat(b);
    }

    /**
     * Function to perform multiplication between 2 values.
     * 
     */
    function performMultiplication(a,b){
        return parseFloat(a) * parseFloat(b);
    }

    /**
     * Function to perform exponentiation (power) operation between 2 values.
     * 
     */
    function performExponentiation(a,b){
        return parseFloat(a) ** parseFloat(b);
    }

    /**
     * Function to perform division between 2 values.
     * 
     */
    function performDivision(a, b){
        // Special case: if the divisor is 0, display an error message.
        if(parseFloat(b) == 0){
            // Error!
            // clear the calculator object.
            errorDisplayed = true;
            return "Error!";
        }else{
            return parseFloat(a) / parseFloat(b);
        }

    }

    /**
     * Function to reset the calculator to it's beginning state.
     */
    function resetCalculator(){
        calculator = {
            'firstOperand': 0,
        };
        displayResult(0);
        displayCalculation("reset");
    }
    
    /**
     * Function to display the result or the error on the calculator display.
     * 
     */
    function displayResult(resultVal){
        document.getElementById("calculator-result-span").textContent = resultVal;
    }

    /**
     * Function to display the calculation.
     */
    function displayCalculation(calculationStr){

        // Generate current calculation based on calculator objects properties.
        if(calculationStr === "reset"){
            document.getElementById("calculator-calculation-span").textContent = "";    
        }else if(calculationStr === "equals"){
            document.getElementById("calculator-calculation-span").textContent = `${generateCurrentCalcString()} = `;
        }else{
            document.getElementById("calculator-calculation-span").textContent = generateCurrentCalcString();
        }
        
    }

    /**
     * Function to generate the calculation string from current calculator object.
     * 
     */
    function generateCurrentCalcString(){
        currentCalcStr = `${calculator.firstOperand}`;
        if("currentOperator" in calculator){
            currentCalcStr += ` ${calculator.currentOperator}`;
        }
        if("secondOperand" in calculator){
            currentCalcStr += ` ${calculator.secondOperand}`;
        }

        return currentCalcStr;
    }

}