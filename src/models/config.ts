import { nanoid } from 'nanoid';
import { defaultWiremockVersion, ProxyProvider } from '../config';

export interface HummockConfigDto {
	provider?: ProxyProvider;
	recordFrom?: ServerForRecordDto[];
	wiremock?: WiremockConfigDto;
}

export class HummockConfig {
	private provider = ProxyProvider.TALKBACK;
	private config = new WiremockConfig(defaultWiremockVersion);
	private serversForRecord: ServerForRecord[] = [];

	public get wiremock(): WiremockConfig {
		return this.config;
	}

	public get servers(): ServerForRecord[] {
		return this.serversForRecord;
	}

	public setServers(servers?: ServerForRecordDto[]): void {
		if (!servers || !servers.length) {
			this.serversForRecord = [];
			return;
		}

		this.serversForRecord = servers.map((server) => new ServerForRecord(server.host));
	}

	public setWiremockConfig(wiremock?: WiremockConfigDto): void {
		if (!wiremock) {
			return;
		}
		this.config = new WiremockConfig(wiremock.version || defaultWiremockVersion);
	}

	public setProvider(provider?: ProxyProvider): void {
		this.provider =
			provider && provider === ProxyProvider.WIREMOCK
				? ProxyProvider.WIREMOCK
				: ProxyProvider.TALKBACK;
	}
}

interface ServerForRecordDto {
	host: string;
}

interface WiremockConfigDto {
	version?: string;
}

class ServerForRecord {
	public readonly id = nanoid(5);
	constructor(public readonly host: string) {}
}

export class WiremockConfig {
	constructor(public readonly version: string) {}
}
