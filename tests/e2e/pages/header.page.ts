import {Locator, Page} from "@playwright/test";

export class HeaderPage {
    public readonly editAmountButton: Locator;
    public readonly modalOverlay: Locator;

    constructor(public page: Page) {
        this.page = page;
        this.editAmountButton = page.getByTestId("bb-edit-amount__amount");
        this.modalOverlay = page.getByTestId("bb-overlay");
    }

    async openModal() {
        await this.editAmountButton.click();
        await this.modalOverlay.waitFor({state: "visible"});
    }
}
