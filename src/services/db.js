import { dbService } from './firebase';

export const db = {
    // Get all orders (Admin)
    getOrders: async () => {
        return await dbService.getAllOrders();
    },

    // Get user specific orders
    getUserOrders: async (userId) => {
        return await dbService.getUserOrders(userId);
    },

    // Save a new order
    saveOrder: async (orderData) => {
        return await dbService.addOrder({
            status: 'Pending',
            ...orderData
        });
    },

    // Update order status
    updateOrderStatus: async (id, status) => {
        return await dbService.updateOrderStatus(id, status);
    },

    // Clear all orders
    clearOrders: () => {
        console.warn("Clear orders not supported in production mode");
    },

    // Products
    getProducts: async () => {
        return await dbService.getAllProducts();
    },

    seedProducts: async (products) => {
        return await dbService.seedProducts(products);
    }
};
