import * as webpack from 'webpack';
import { AppPaths } from '../paths';
import { generate as generateCommon } from './webpack.config.common';

export function generate(): webpack.Configuration {
	const paths = new AppPaths();
	const config = generateCommon(false);
	const plugins = config.plugins || [];
	config.devtool = 'cheap-module-eval-source-map';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config.entry as any).hmr = paths.modules.hmr;

	config.plugins = [
		...plugins,
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	];
	return config;
}
