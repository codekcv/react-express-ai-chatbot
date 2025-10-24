import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

// Implementation detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required.')
    .max(1000, 'Prompt is too long (max 1000 characters).'),
  conversationId: z.uuid(),
});

// Public interface
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    try {
      const { prompt, conversationId } = req.body;
      const response = await chatService.sendMessage(conversationId, prompt);

      res.json({ reply: response.message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get response from OpenAI.' });
    }
  },
};
