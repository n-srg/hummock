import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';
import { Logger, pGreen, pYellow } from '../log';
import { ServerForRecordState } from '../../config';
import { getLaunchers, LauncherService } from '../launcher';
import { ServerToggleDto } from '../../models/types';

const logger = new Logger('api');

export function pickApiRoutes(app: Application, config: HummockConfig) {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);
	app.all('/api/*', showNotFound);
}

class ApiRouter {
	public readonly router = Router();

	private readonly launchers: LauncherService[];

	constructor(private readonly config: HummockConfig) {
		this.launchers = getLaunchers(config);
		this.handleRoutes();
	}

	private handleRoutes() {
		this.router.get('/config', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send(this.config);
		});

		this.router.get('/proxies', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send({
				total: this.config.servers.length,
				items: this.launchers.map(launcher => launcher.getListDto())
			});
		});

		this.router.get('/proxies/:proxyId', (req: Request, res: Response, next: NextFunction) => {
			const id = req.params.proxyId;
			const launcher = this.launchers.find(instance => instance.server.id === id);

			if (!launcher) {
				res.status(404).send({ message: `Host with id=${id} not found` });
				return;
			}

			res.status(200).send(launcher.getDto());
		});

		this.router.post('/proxies', (req: Request, res: Response, next: NextFunction) => {
			const toggleData: ServerToggleDto = req.body;

			logger.info(!toggleData.run ? 'Stopping mock servers' : 'Starting mock servers');

			Promise.all(
				toggleData.ids.map(id => {
					const launcher = this.launchers.find(item => item.server.id === id);
					if (!launcher) {
						logger.warn(pYellow(`Unable to toggle launcher with id=${id}`));
					}
					return toggleData.run ? launcher.start() : launcher.stop();
				})
			)
				.then(() => {
					logger.info(
						pGreen('all good'),
						this.launchers.map(launcher => launcher.state)
					);
					res.status(200).send({});
				})
				.catch(err => {
					logger.error(err);
					res.status(500).send({});
				});
		});

		this.router.all('/*', showNotFound);
	}
}

function showNotFound(req: Request, res: Response) {
	res.status(404).send({
		message: 'Not found'
	});
}
