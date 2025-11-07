import {Locator, Page} from "@playwright/test";

export class CalculatorModalPage {
    private amountInput: Locator;
    private readonly amountSlider: Locator;
    public currentAmount: any;

    private periodInput: Locator;
    private readonly periodSlider: Locator;
    public currentPeriod: any;

    private submitButton: Locator;
    public modalOverlay: Locator;

    constructor(public readonly page: Page) {
        this.page = page;

        this.amountInput = page.locator('input[name="header-calculator-amount"]');
        this.amountSlider = page.getByRole('slider').nth(0);
        // this.currentAmount = this.amountSlider.getAttribute('aria-valuenow')

        this.periodInput = page.locator('input[name="header-calculator-period"]');
        this.periodSlider = page.getByRole('slider').nth(1);
        // this.currentPeriod = this.periodSlider.getAttribute('aria-valuenow');

        this.submitButton = page.getByTestId("bb-button").filter({ hasText: "JÄTKA" });
        this.modalOverlay = page.getByTestId("bb-overlay");
    }

    async navigateToModalPage() {
        // URL is added here explicitly due to the size of task, otherwise, it should be added to a separate file
        await this.page.goto('/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS', {waitUntil: "domcontentloaded"});
    }

    async closeModal() {
        await this.submitButton.click();
    }

    async updateLoanDetails({useInput=true, useSlider=false, amount, period}:{ useInput?: boolean; useSlider?: boolean, amount?: string, period?: string }) {
        if (useSlider) {
            await this.moveSlider(this.amountSlider);
            await this.moveSlider(this.periodSlider);
        }
        if (useInput && amount && period) {
            await this.amountInput.fill(amount);
            await this.periodInput.fill(period);
        }
    }

    async moveSlider(slider: Locator) {
        const handle = await slider.elementHandle();
        // @ts-ignore
        const box = await handle.boundingBox();

        // @ts-ignore
        const startX = box.x + box.width / 2;
        // @ts-ignore
        const startY = box.y + box.height / 2;

        await slider.scrollIntoViewIfNeeded();
        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + 50, startY, {steps: 1});
        await this. page.mouse.up();
    }

    // option A: async methods
    async getCurrentAmount(){
        return await this.amountSlider.getAttribute('aria-valuenow');
    }

    async getCurrentPeriod() {
        return await this.periodSlider.getAttribute('aria-valuenow');
    }

}