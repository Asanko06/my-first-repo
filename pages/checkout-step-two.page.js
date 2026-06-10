class CheckoutStepTwoPage {
    constructor(page) {
        this.page = page;
        this.orderSummary = page.locator('.cart_list');
        this.totalAmount = page.locator('.summary_total_label');
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
}

module.exports = { CheckoutStepTwoPage };
