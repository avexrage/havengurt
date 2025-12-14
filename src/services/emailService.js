import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

console.log("DEBUG: Keys Loaded?", {
    ServiceId: SERVICE_ID ? SERVICE_ID.substring(0, 5) + "..." : "MISSING",
    TemplateId: TEMPLATE_ID ? TEMPLATE_ID.substring(0, 5) + "..." : "MISSING",
    PublicKey: PUBLIC_KEY ? PUBLIC_KEY.substring(0, 5) + "..." : "MISSING"
});

export const emailService = {
    // Send email using EmailJS
    sendEmail: async (to, subject, body, type = 'generic') => {
        try {
            console.log(`📧 [Email Service] Sending ${type} email to ${to}...`);

            // Validate keys before sending
            if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
                console.error("❌ CRITICAL: Missing EmailJS Keys!", { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
                return false;
            }

            const templateParams = {
                to_email: to,
                subject: subject,
                message: body,
                type: type
            };

            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            if (response.status === 200) {
                console.log('✅ Email sent successfully!');
                return true;
            } else {
                console.error('❌ Email sending failed:', response);
                return false;
            }
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return false;
        }
    },

    sendOrderPlaced: async (order) => {
        const adminEmail = "poayof@gmail.com"; // Admin email for notifications

        // 1. Email to Admin
        await emailService.sendEmail(
            adminEmail,
            `New Order #${order.id.slice(0, 8)}`,
            `New order received from ${order.payment.senderName}.\nTotal: Rp ${order.payment.total.toLocaleString()}\nStatus: Pending Validation\n\nView Dashboard: https://havengurt.vercel.app/admin`,
            'new_order_admin'
        );

        // 2. Email to Customer
        const customerEmail = order.customerEmail || order.userId; // Fallback logic
        if (customerEmail && customerEmail.includes('@')) {
            await emailService.sendEmail(
                customerEmail,
                `Order #$Received - Havengurt`,
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
                message = `Hi ${customerName},\n\nGreat news! Your payment has been verified. We are now preparing your fresh yogurt.\n\nOrder #${orderId.slice(0, 8)}\nDelivery Date: ${new Date().toLocaleDateString()}`;
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
