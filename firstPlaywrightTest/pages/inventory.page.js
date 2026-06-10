class InventoryPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async getPageTitle() {
        return await this.pageTitle.textContent();
    }

    async sortByPriceHighToLow() {
        await this.sortDropdown.selectOption('hilo');
    }

    async getFirstItemName() {
        return await this.page.locator('.inventory_item_name').first().textContent();
    }

    async addItemToCart(itemName) {
        const item = this.inventoryItems.filter({ hasText: itemName });
        await item.getByRole('button', { name: 'Add to cart' }).click();
    }

    async openCart() {
        await this.cartIcon.click();
    }
}

module.exports = { InventoryPage };
