export interface ServerToggleDto {
	run: boolean;
	ids: string[];
}

export interface Dictionary<Data> {
	[key: string]: Data;
}

export interface ListDto<Data> {
	total: number;
	items: Data[];
}

export interface ServerListDetailsDto extends ServerCoreDetailsDto {
	stubbs: {
		total: number;
	};
}

export interface ServerDetailsDto extends ServerCoreDetailsDto {
	stubbs: ListDto<StubbDetailsDto>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerListDto extends ListDto<ServerListDetailsDto> {}

export enum ServerForRecordState {
	IDLE = 'idle',
	RUN = 'run'
}

interface ServerCoreDetailsDto {
	state: ServerForRecordState;
	id: string;
	host: string;
	port: number;
}

export interface StubbDetailsDto {
	name: string;
	content: StubbFileDto;
}

export interface StubbFileDto {
	meta: {
		createdAt: string;
		host: string;
	};
	req: {
		url: string;
		method: string;
		headers: Dictionary<string>;
		body: string;
	};
	res: {
		status: number;
		headers: Dictionary<string[]>;
		body: string;
	};
}
