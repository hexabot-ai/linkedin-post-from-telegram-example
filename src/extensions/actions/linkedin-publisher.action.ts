/*
 * Hexabot — Fair Core License (FCL-1.0-ALv2)
 * Copyright (c) 2025 Hexastack.
 * Full terms: see LICENSE.md.
 */

import { createAction } from '@hexabot-ai/api';
import { WorkflowRuntimeContext } from '@hexabot-ai/api/dist/workflow/contexts/workflow-runtime.context';
import axios from 'axios';
import { z } from 'zod';

const linkedinPublisherInputSchema = z.object({
  text: z.string().min(1).meta({
    title: 'Text',
    description: 'The text content to publish as a LinkedIn post',
  }),
});
const linkedinPublisherSettingsSchema = z.strictObject({
  access_token: z.string().min(1).meta({
    title: 'Access Token',
    description:
      'LinkedIn API OAuth 2.0 access token with w_member_social scope',
  }),
  author: z.string().optional().meta({
    title: 'Default Author URN',
    description: 'Default LinkedIn author URN (e.g. urn:li:member:12345)',
  }),
});
const linkedinPublisherOutputSchema = z.object({
  success: z.boolean(),
  status: z.number().optional(),
  body: z.any().optional(),
});

type LinkedInPublisherInput = z.infer<typeof linkedinPublisherInputSchema>;
type LinkedInPublisherOutput = z.infer<typeof linkedinPublisherOutputSchema>;
type LinkedInPublisherSettings = z.infer<
  typeof linkedinPublisherSettingsSchema
>;

export const LinkedInPublisherAction = createAction<
  LinkedInPublisherInput,
  LinkedInPublisherOutput,
  WorkflowRuntimeContext,
  LinkedInPublisherSettings
>({
  name: 'linkedin_publisher',
  description: 'Publishes a post to LinkedIn via API v2',
  group: 'web',
  icon: 'Linkedin',
  color: '#0A66C2',
  inputSchema: linkedinPublisherInputSchema,
  outputSchema: linkedinPublisherOutputSchema,
  settingsSchema: linkedinPublisherSettingsSchema,
  async execute({ input, settings }) {
    try {
      const author = settings.author;

      if (!author) {
        return {
          success: false,
          status: 400,
          body: {
            error:
              'Author URN is required. Provide it in settings or as input.',
          },
        };
      }

      const response = await axios.request({
        url: 'https://api.linkedin.com/v2/ugcPosts',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
        data: {
          author: `urn:li:person:${settings.author}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: input.text },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        validateStatus: () => true,
      });

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        body: response.data,
      };
    } catch (error) {
      return {
        success: false,
        body: { error: (error as Error).message },
      };
    }
  },
});

export default LinkedInPublisherAction;
