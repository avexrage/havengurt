export const emailService = {
    // Simulate sending an email (To be replaced with EmailJS or similar)
    sendEmail: (to, subject, body, type = 'generic') => {
        console.group('📧 [Email Service] Sending Email...');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', body);
        console.log('Type:', type);
        console.groupEnd();

        // In a real implementation:
        // emailjs.send('service_id', 'template_id', { to_email: to, ...params })

        return Promise.resolve(true);
    },

    sendOrderPlaced: async (order) => {
        const adminEmail = "poayof@gmail.com"; // Admin email for notifications

        // 1. Email to Admin
        await emailService.sendEmail(
            adminEmail,
            `New Order #${order.id.slice(0, 8)}`,
            `New order received from ${order.payment.senderName}.\nTotal: Rp ${order.payment.total.toLocaleString()}\nStatus: Pending Validation`,
            'new_order_admin'
        );

        // 2. Email to Customer
        const customerEmail = order.customerEmail || order.userId; // Fallback logic
        if (customerEmail && customerEmail.includes('@')) {
            await emailService.sendEmail(
                customerEmail,
                `Order #${order.id.slice(0, 8)} Received - Havengurt`,
                `Hi ${order.payment.senderName},\n\nThank you for your order! We have received your payment proof and are currently verifying it.\n\nItems:\n${order.items.map(i => `- ${i.name} (${i.quantity}x)`).join('\n')}\n\nWe will notify you once your order is confirmed.\n\nWarm Regards,\nHavengurt Team`,
                'new_order_customer'
            );
        }
    },

    sendStatusUpdate: async (orderId, newStatus, customerEmail, customerName) => {
        if (!customerEmail || !customerEmail.includes('@')) return;

        let subject = "";
        let message = "";

        switch (newStatus) {
            case "Paid":
                subject = `Payment Verified - Order #${orderId.slice(0, 8)}`;
                message = `Hi ${customerName},\n\nGreat news! Your payment has been verified. We are now preparing your fresh yogurt.\n\nOrder #${orderId.slice(0, 8)}\nDelivery Date: ${new Date().toLocaleDateString()}`; // Date logic needs improvement per order
                break;
            case "Delivered":
                subject = `Order Delivered! - Order #${orderId.slice(0, 8)}`;
                message = `Hi ${customerName},\n\nYour Havengurt order has arrived! We hope you enjoy it.\n\nDon't forget to keep it chilled!\n\nThank you for choosing us,\nHavengurt Team`;
                break;
            case "Cancelled":
                subject = `Order Cancelled - Order #${orderId.slice(0, 8)}`;
                message = `Hi ${customerName},\n\nWe regret to inform you that your order #${orderId.slice(0, 8)} has been cancelled. If you have already paid, please contact us for a refund.\n\nReason: Admin Action`;
                break;
            default:
                return;
        }

        await emailService.sendEmail(customerEmail, subject, message, 'status_update');
    }
};
