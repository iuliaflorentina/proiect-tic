const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { findEventById, updateEvent } = require('../models/events');
const { findById, updateUser } = require('../models/users');

const createCheckoutSession = async (req, res) => {
    try {
        const { tickets, userId } = req.body;

        if (!tickets || tickets.length === 0) {
            return res.status(400).json({ message: 'No tickets provided' });
        }

        const lineItems = tickets.map(ticket => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${ticket.event.name} - ${ticket.type}`,
                    description: `Event Date: ${new Date(ticket.event.date).toLocaleDateString()}`,
                },
                unit_amount: Math.round(ticket.price * 100),
            },
            quantity: ticket.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/events/${tickets[0].event.eventId}`,
            metadata: {
                userId: userId,
                tickets: JSON.stringify(tickets),
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await fulfillOrder(session);
    }

    res.status(200).json({ received: true });
};

async function fulfillOrder(session) {
    const userId = session.metadata.userId;
    const tickets = JSON.parse(session.metadata.tickets);

    try {
        const userDoc = await findById(userId);
        if (userDoc.exists) {
            const userData = userDoc.data();
            const updatedTickets = [...(userData.boughtTickets || []), ...tickets];
            await updateUser(userId, { boughtTickets: updatedTickets });
        }

        const eventId = tickets[0].event.eventId;
        const eventData = await findEventById(eventId);
        if (eventData) {
            const updatedTickets = eventData.tickets.map(t => {
                const purchased = tickets.find(pt => pt.type.toLowerCase() === t.type.toLowerCase());
                if (purchased) {
                    return {
                        ...t,
                        availableQuantity: t.availableQuantity - purchased.quantity
                    };
                }
                return t;
            });
            await updateEvent(eventId, { tickets: updatedTickets });
        }

        console.log(`Order fulfilled for user ${userId}`);
    } catch (error) {
        console.error('Fulfillment Error:', error);
    }
}

module.exports = {
    createCheckoutSession,
    handleWebhook
};
