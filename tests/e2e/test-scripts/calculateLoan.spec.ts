import { test, expect } from "../e2e-fixtures/e2eFixtures";

test.describe("Loan Calculation tests", async function () {

    let newLoanAmount: any = "8000";
    let newLoanPeriod: any = "12"
    const defaultLoanAmount: string = "5000";
    const defaultLoanPeriod: string = "60";

    test("Calculate Loan installment with direct input", async function ({ calculatorModal, header}) {
        await test.step("Open the modal and verify the default values", async function () {
            await calculatorModal.navigateToModalPage();
            expect(await calculatorModal.getCurrentAmount()).toEqual(defaultLoanAmount);
            expect(await calculatorModal.getCurrentPeriod()).toEqual(defaultLoanPeriod);
        });

        await test.step("Update Amount using Numeric Input", async function () {
            await calculatorModal.updateLoanDetails({useInput: true, amount: newLoanAmount, period: newLoanPeriod });
        });

        await test.step("Close the modal", async function () {
            await calculatorModal.closeModal();
        });

        // Additional (not asked) step
        await test.step("Get Loan value from the header & verify its same as one set", async function () {
            const updatedLoanAmountHeader = await header.editAmountButton.innerText();
            expect(updatedLoanAmountHeader).toEqual(newLoanAmount + " €");
        });

        await test.step("Reopen the modal and verify that Loan Amount and Period values are the ones defined in Step 2", async function (){
            await header.editAmountButton.click();
            expect(await calculatorModal.getCurrentAmount()).toEqual(newLoanAmount);
            expect(await calculatorModal.getCurrentPeriod()).toEqual(newLoanPeriod);
        });
    });

    test("Calculate Loan installment with Slider input", async function ( {calculatorModal, header }) {
        await test.step("Open the modal", async function () {
            await calculatorModal.navigateToModalPage();
        });

        await test.step("Update Amount using Slider Input", async function () {
            await calculatorModal.updateLoanDetails({ useSlider: true });
        });

        await test.step("Get the updated values from the input boxes", async function () {
            newLoanAmount = await calculatorModal.getCurrentAmount();
            newLoanPeriod = await calculatorModal.getCurrentPeriod();
        });

        await test.step("Close and Reopen the modal, then verify that values are updated", async function () {
            await calculatorModal.closeModal();
            await header.editAmountButton.click();
            expect(await calculatorModal.getCurrentAmount()).toEqual(newLoanAmount);
            expect(await calculatorModal.getCurrentPeriod()).toEqual(newLoanPeriod);
        })
    })

})