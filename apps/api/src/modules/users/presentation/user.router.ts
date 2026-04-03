/* import { Hono } from 'hono';
  import { authMiddleware } from '../../../middlewares/auth.middleware';
  import type { makeVoteSuggestionUseCase } from '../application/use-cases/vote-suggestion.use-case';
  import type { makeCreateSuggestionUseCase } from '../application/use-cases/create-suggestion.use-case';

  type Deps = {
    createSuggestion: ReturnType<typeof makeCreateSuggestionUseCase>;
    voteSuggestion: ReturnType<typeof makeVoteSuggestionUseCase>;
  };

  export function createSuggestionRouter(deps: Deps) {
    const app = new Hono();

    app.get('/', async (c) => {
      const projectId = c.req.query('projectId');
      if (!projectId) return c.json({ error: 'projectId required' }, 400);
      const result = await deps.createSuggestion(...);
      return c.json(result);
    });

    app.post('/:id/vote', authMiddleware, async (c) => {
      const user = c.var.user;
      await deps.voteSuggestion(c.req.param('id'), user.id);
      return c.json({ ok: true });
    });

    return app;
  } */
