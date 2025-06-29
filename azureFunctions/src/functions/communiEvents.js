import { app } from '@azure/functions';
import { fetchCommuniEvents } from '../../../communi.js';

app.http('communiEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const events = await fetchCommuniEvents();

        return { body: JSON.stringify(events) };
    }
});
