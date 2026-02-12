import { CollectionConfig } from 'payload';

const Orders: CollectionConfig = {
    slug: 'orders',
    access: {
        create: () => true,
    },
    admin: {
        useAsTitle: 'customerName',
    },
    fields: [
        {
            name: 'customerName',
            type: 'text',
            required: true,
        },
        {
            name: 'customerCashtag',
            type: 'text',
            required: true,
            label: 'Customer $Cashtag',
        },
        {
            name: 'shippingAddress',
            type: 'text',
            required: true,
        },
        {
            name: 'city',
            type: 'text',
            required: true,
        },
        {
            name: 'state',
            type: 'text',
            required: true,
        },
        {
            name: 'zip',
            type: 'text',
            required: true,
        },
        {
            name: 'phoneNumber',
            type: 'text',
            required: true,
        },
        {
            name: 'orderItems',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'name',
                    type: 'text',
                },
                {
                    name: 'quantity',
                    type: 'number',
                },
                {
                    name: 'price',
                    type: 'number',
                },
            ],
        },
        {
            name: 'totalPrice',
            type: 'number',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'Pending Payment',
            options: [
                { label: 'Pending Payment', value: 'Pending Payment' },
                { label: 'Paid', value: 'Paid' },
                { label: 'Shipped', value: 'Shipped' },
            ],
        },
    ],
    hooks: {
        afterChange: [
            ({ doc, operation }) => {
                if (operation === 'create') {
                    // 1. Email Notification (Non-blocking)
                    (async () => {
                        try {
                            const nodemailer = await import('nodemailer');
                            const transporter = nodemailer.createTransport({
                                host: process.env.EMAIL_HOST,
                                port: Number(process.env.EMAIL_PORT) || 587,
                                secure: false,
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS,
                                },
                            });

                            const mailOptions = {
                                from: '"PattiCakeSlime System" <no-reply@pattycakeslime.com>',
                                to: process.env.CLIENT_EMAIL || 'nasirhenken09@gmail.com',
                                subject: `New Order from ${doc.customerName} - $${doc.totalPrice}`,
                                text: `New Order Received!\n\nCustomer: ${doc.customerName}\nPhone: ${doc.phoneNumber}\nTotal: $${doc.totalPrice}\n\nItems:\n${doc.orderItems.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n')}\n\nShipping Address:\n${doc.shippingAddress}, ${doc.city}, ${doc.state} ${doc.zip}`,
                            };

                            await transporter.sendMail(mailOptions);
                            console.log('Order notification email sent.');
                        } catch (error) {
                            console.error('Failed to send email notification:', error);
                        }
                    })();

                    // 2. SMS Notification (Twilio) (Non-blocking)
                    (async () => {
                        try {
                            const twilio = (await import('twilio')).default;
                            const accountSid = process.env.TWILIO_ACCOUNT_SID;
                            const authToken = process.env.TWILIO_AUTH_TOKEN;
                            if (accountSid && authToken) {
                                const client = twilio(accountSid, authToken);

                                await client.messages.create({
                                    body: `💰 New Order! ${doc.customerName} just spent $${doc.totalPrice} on PattiCakeSlime. They match payment from: ${doc.customerCashtag}. Check Cash App!`,
                                    from: process.env.TWILIO_PHONE_NUMBER,
                                    to: '+17063467555',
                                });
                                console.log('Order notification SMS sent.');
                            } else {
                                console.log('Twilio credentials missing, skipping SMS.');
                            }
                        } catch (error) {
                            console.error('Failed to send SMS notification:', error);
                        }
                    })();
                }
            },
        ],
    },
};

export default Orders;
