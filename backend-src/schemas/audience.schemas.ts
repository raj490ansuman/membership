import { z } from 'zod';

const zAudience = z.object({
    audienceGroupId: z.string().max(50),
    audienceCount: z.number().nonnegative().default(0),
    description: z.string().max(120).nullable(),
    searchCondition: z.any().nullable(),  // JSON field
    remarks: z.any().nullable(),  // JSON field
    createdAt: z.date(),
    updatedAt: z.date()
});

export { zAudience };
