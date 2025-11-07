import { test as base } from "@playwright/test";
import { CalculatorModalPage} from "../pages/calculatorModal.page";
import {HeaderPage} from "../pages/header.page";

type E2EFixtures = {
    calculatorModal: CalculatorModalPage;
    header: HeaderPage;
}

export const test = base.extend<E2EFixtures> ({
    calculatorModal: async ({ page }, use) => {
        const calculatorModal = new CalculatorModalPage(page);
        await use(calculatorModal);
    },

    header: async ({ page }, use) => {
        const header = new HeaderPage(page);
        await use(header);
    }
});

export const expect = test.expect;