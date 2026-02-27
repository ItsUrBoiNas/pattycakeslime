import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';

/** Strip HTML tags from a string to prevent XSS/injection */
function sanitize(input: string): string {
    return input.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: Request) {
    try {
        // --- Rate Limiting ---
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many orders. Please wait 15 minutes before trying again.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const {
            customerName,
            customerCashtag,
            shippingAddress,
            city,
            state,
            zip,
            phoneNumber,
            orderItems,
            totalPrice
        } = body;

        // Validation
        if (!customerName || !customerCashtag || !phoneNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Sanitize all string inputs
        const safe = {
            customerName: sanitize(customerName),
            customerCashtag: sanitize(customerCashtag),
            shippingAddress: sanitize(shippingAddress || ''),
            city: sanitize(city || ''),
            state: sanitize(state || ''),
            zip: sanitize(zip || ''),
            phoneNumber: sanitize(phoneNumber),
        };

        // Save to Supabase
        const { data: order, error: supabaseError } = await supabase
            .from('orders')
            .insert({
                customer_name: safe.customerName,
                customer_cashtag: safe.customerCashtag,
                shipping_address: safe.shippingAddress,
                city: safe.city,
                state: safe.state,
                zip: safe.zip,
                phone_number: safe.phoneNumber,
                order_items: orderItems, // JSONB
                total_price: totalPrice,
                status: 'Pending Payment'
            })
            .select()
            .single();

        if (supabaseError) {
            console.error('Supabase error:', supabaseError);
            return NextResponse.json(
                { error: `Database Error: ${supabaseError.message}` },
                { status: 500 }
            );
        }

        // SMS Notification (Non-blocking)
        (async () => {
            try {
                const twilio = (await import('twilio')).default;
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                if (accountSid && authToken) {
                    const client = twilio(accountSid, authToken);
                    await client.messages.create({
                        body: `💰 New Order! ${safe.customerName} just spent $${totalPrice} on PattiCakeSlime. Payment from: ${safe.customerCashtag}. Check Cash App!`,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: '+17063467555',
                    });
                }
            } catch (err) {
                console.error('SMS notification failed:', err);
            }
        })();

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
            orderId: order.id
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API Route Error:', message);
        return NextResponse.json(
            { error: `Server Error: ${message}` },
            { status: 500 }
        );
    }
}

