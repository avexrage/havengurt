import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

console.log("DEBUG: Keys Loaded?", {
    ServiceId: SERVICE_ID ? SERVICE_ID.substring(0, 5) + "..." : "MISSING",
    TemplateId: TEMPLATE_ID ? TEMPLATE_ID.substring(0, 5) + "..." : "MISSING",
    PublicKey: PUBLIC_KEY ? PUBLIC_KEY.substring(0, 5) + "..." : "MISSING"
});

const GENERATE_HTML_TEMPLATE = (title, bodyContent, footerInfo) => `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #115AA6 0%, #0EA5E9 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">HAVENGURT</h1>
      <p style="margin: 5px 0 0; opacity: 0.9;">Authentic Wonosobo Goodness</p>
    </div>
    <div style="padding: 30px; color: #334155; line-height: 1.6;">
      <h2 style="color: #115AA6; margin-top: 0;">${title}</h2>
      ${bodyContent} 
    </div>
    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
      ${footerInfo}
      <p>&copy; ${new Date().getFullYear()} Havengurt. All rights reserved.</p>
    </div>
  </div>
</div>
`;

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
                // We send the entire HTML body as 'message'
                message: body,
                type: type
            };

            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            if (response.status === 200) {
                console.log(`✅ [${type}] Email sent successfully!`);
                return true;
            } else {
                console.error(`❌ [${type}] Email sending failed:`, response);
                return false;
            }
        } catch (error) {
            console.error(`❌ [${type}] Error sending email:`, error);
            return false;
        }
    },

    sendOrderPlaced: async (order) => {
        const adminEmail = "havengurt@gmail.com";

        // 1. Prepare Admin Email
        const adminBody = `
            <p><strong>New Order Received!</strong></p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
                <p><strong>Customer:</strong> ${order.payment.senderName}</p>
                <p><strong>Total:</strong> Rp ${order.payment.total.toLocaleString()}</p>
                <p><strong>Status:</strong> <span style="color: #eab308; font-weight: bold;">Pending Validation</span></p>
            </div>
            <p>Please check the admin dashboard to validate payment.</p>
            <br/>
            <a href="https://havengurt.vercel.app/admin" style="display: inline-block; background-color: #115AA6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
        `;

        const adminPromise = emailService.sendEmail(
            adminEmail,
            `New Order #${order.id.slice(0, 8)}`,
            GENERATE_HTML_TEMPLATE("New Order Received", adminBody, "System Notification"),
            'new_order_admin'
        );

        // 2. Prepare Customer Email
        let customerPromise = Promise.resolve(); // Default empty
        const customerEmail = order.customerEmail || order.userId;

        if (customerEmail && customerEmail.includes('@')) {
            const itemsHtml = order.items.map(i => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                    <span>${i.name} x${i.quantity}</span>
                    <span>Rp ${(i.price * i.quantity).toLocaleString()}</span>
                </div>
            `).join('');

            const customerBody = `
                <p>Hi <strong>${order.payment.senderName}</strong>,</p>
                <p>Thank you for choosing Havengurt! We have received your payment proof and are currently verifying it.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary (#${order.id.slice(0, 8)})</h3>
                    ${itemsHtml}
                    <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: bold; font-size: 18px; color: #115AA6; border-top: 2px solid #e2e8f0; margin-top: 10px;">
                        <span>Total</span>
                        <span>Rp ${order.payment.total.toLocaleString()}</span>
                    </div>
                </div>

                <p>We will notify you again once your order is confirmed and out for delivery.</p>
            `;

            customerPromise = emailService.sendEmail(
                customerEmail,
                `Order #${order.id.slice(0, 8)} Received - Havengurt`,
                GENERATE_HTML_TEMPLATE("We Got Your Order!", customerBody, "Need help? Reply to this email."),
                'new_order_customer'
            );
        }

        // Run both safely
        await Promise.allSettled([adminPromise, customerPromise]);
    },

    sendStatusUpdate: async (orderId, newStatus, customerEmail, customerName) => {
        if (!customerEmail || !customerEmail.includes('@')) return;

        let title = "";
        let bodyFragment = "";

        switch (newStatus) {
            case "Paid":
                title = "Payment Verified!";
                bodyFragment = `
                    <p>Great news! Your payment has been verified.</p>
                    <p>We are now preparing your fresh yogurt with the highest quality ingredients.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                         <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
                         <p><strong>Estimated Delivery:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                `;
                break;
            case "Delivered":
                title = "Order Delivered!";
                bodyFragment = `
                    <p>Your Havengurt order has arrived!</p>
                    <p>We hope you enjoy the authentic taste of Wonosobo.</p>
                    <p style="background-color: #ecfccb; padding: 10px; border-radius: 4px; color: #3f6212;"><strong>Tip:</strong> Don't forget to keep your yogurt chilled for the best experience!</p>
                `;
                break;
            case "Cancelled":
                title = "Order Cancelled";
                bodyFragment = `
                    <p>We regret to inform you that your order #${orderId.slice(0, 8)} has been cancelled.</p>
                    <p>If you have already made a payment, please contact us immediately for a refund.</p>
                    <p><strong>Reason:</strong> Admin Verification Failed</p>
                `;
                break;
            default:
                return;
        }

        await emailService.sendEmail(
            customerEmail,
            `${title} - Order #${orderId.slice(0, 8)}`,
            GENERATE_HTML_TEMPLATE(title, bodyFragment, "Havengurt Customer Service"),
            'status_update'
        );
    }
};
