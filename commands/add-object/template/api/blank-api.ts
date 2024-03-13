import { Response } from 'express';
import { {{ nameCamel }}Mapper } from './{{ nameKebab }}';
import { isAdmin } from '../../middleware/is-admin';
import { RequestContext } from '../../util/request-context.type';
import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import { {{ nameCamel }}Service } from './{{ nameKebab }}.service';

const app = createApp();
// app.use(isAdmin); // All private endpoints require the user to be an admin
export const handler = createAuthenticatedHandler(app);

app.post('/{{ nameKebab }}', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { {{ apiCreateFields }} } = req.body as {{ nameFirst }};
      const {{ nameCamel }}Data: Partial<{{ nameFirst }}> = {
        {{ apiCreateFields }},
      };
      const {{ nameCamel }} = await {{ nameCamel }}Service.create({{ nameCamel }}Data);
      res.json({{ nameCamel }}Mapper({{ nameCamel }}));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to create {{ nameLower }} ${message}`);
      res.status(400).json({ error: 'Failed to create {{ nameLower }}' });
    }
  },
]);

app.patch('/{{ nameKebab }}', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { {{ apiUpdateFields }} } = req.body as {{ nameFirst }};
      const {{ nameCamel }}Data: Partial<{{ nameFirst }}> = {
        {{ apiUpdateFields }}
      };
      const {{ nameCamel }} = await {{ nameCamel }}Service.update({{ nameCamel }}Data);
      res.json({{ nameCamel }}Mapper({{ nameCamel }}));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to update {{ nameLower }}: ${message}`);
      res.status(400).json({
        error: 'Failed to update {{ nameLower }}',
      });
    }
  },
]);

app.delete('/{{ nameKebab }}/:{{ primaryKey }}', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const {{ primaryKey }} = req.params.{{ primaryKey }};
      await {{ nameCamel }}Service.delete({{ primaryKey }});
      res.status(200);
      res.send();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to delete {{ nameLower }}: ${message}`);
      res.status(400).json({
        error: 'Failed to delete {{ nameLower }}',
      });
    }
  },
]);

app.get('/{{ nameKebab }}/list', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const {{ nameCamel }}s = await {{ nameCamel }}Service.getAll();
      const formatted{{ nameFirst }}s = {{ nameCamel }}s.map({{ nameCamel }}Mapper);
      res.json(formatted{{ nameFirst }}s);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get {{ nameLower }}s: ${message}`);
      res.status(400).json({
        error: 'Failed to get {{ nameLower }}s',
      });
    }
  },
]);

app.get('/{{ nameKebab }}/:{{ primaryKey }}', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const {{ nameCamel }} = await {{ nameCamel }}Service.get(req.params.{{ primaryKey }});
      res.json({{ nameCamel }}Mapper({{ nameCamel }}));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get {{ nameLower }}: ${message}`);
      res.status(400).json({
        error: 'Failed to get {{ nameLower }}',
      });
    }
  },
]);
