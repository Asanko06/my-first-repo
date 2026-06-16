const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { InventoryPage } = require('../pages/inventory.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutStepOnePage } = require('../pages/checkout-step-one.page');
const { CheckoutStepTwoPage } = require('../pages/checkout-step-two.page');
const { CheckoutCompletePage } = require('../pages/checkout-complete.page');

test.describe('E2E: полный цикл покупки', () => {

    test('покупка самого дорогого товара @ui', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(inventoryPage.pageTitle).toHaveText('Products');

        await inventoryPage.sortByPriceHighToLow();
        const mostExpensiveItem = await inventoryPage.getFirstItemName();
        await inventoryPage.addItemToCart(mostExpensiveItem);

        await inventoryPage.openCart();

        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems).toContain(mostExpensiveItem);

        await cartPage.goToCheckout();

        await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');

        await checkoutStepTwoPage.finishCheckout();

        const completionMessage = await checkoutCompletePage.getCompletionMessage();
        expect(completionMessage).toBe('Thank you for your order!');
    });

});
