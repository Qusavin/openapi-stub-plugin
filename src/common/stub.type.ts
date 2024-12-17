type Request = {
	url: string;
	urlFragment?: string;
	method: string;
	headers: any;
	postData?: string;
	hasPostData?: boolean;
	mixedContentType?: string;
	initialPriority: string;
	referrerPolicy: string;
	isLinkPreload?: boolean;
};

export type StubPredicate = (request: Request) => boolean;
export type StubMock =
	| { body: any; headers: Record<string, string>; status?: number }
	| ((body: any) => any);

export interface IStub {
	predicate: StubPredicate;
	mock?: StubMock;
}
