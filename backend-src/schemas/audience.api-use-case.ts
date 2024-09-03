import { z } from 'zod';
import { zCommonResponse } from './common.schemas';
import { zAudience } from './audience.schemas';

const zListAudiencesRequest = z.object({});
const zListAudiencesResponse = zCommonResponse.extend({
    data: zAudience.array()
}).strict();

const zSearchAudienceRequest = z.object({});
  const zSearchAudienceResponse = z.object({});

const zCreateAudienceRequest = z.object({
    audienceGroupId: z.string().max(15),
    audienceCount: z.number().nonnegative().default(0),
    description: z.string().max(120).nullable(),
    searchCondition: z.any().nullable(),
    remarks: z.any().nullable()
}).strict();
const zCreateAudienceResponse = zCommonResponse;

const zUpdateAudiencePathParams = z.object({
    audienceGroupId: z.string().max(15)
}).strict();
const zUpdateAudienceRequestBody = z.object({
    audienceCount: z.number().nonnegative().optional(),
    description: z.string().max(120).nullable().optional(),
    searchCondition: z.any().nullable().optional(),
    remarks: z.any().nullable().optional()
}).strict();
const zUpdateAudienceResponse = zCommonResponse;

const zDeleteAudiencePathParams = z.object({
    audienceGroupId: z.string()
}).strict();
const zDeleteAudienceResponse = zCommonResponse;

export {
    zListAudiencesRequest,
    zListAudiencesResponse,
    zCreateAudienceRequest,
    zCreateAudienceResponse,
    zUpdateAudiencePathParams,
    zUpdateAudienceRequestBody,
    zUpdateAudienceResponse,
    zDeleteAudiencePathParams,
    zDeleteAudienceResponse,
    zSearchAudienceRequest,
    zSearchAudienceResponse
};
