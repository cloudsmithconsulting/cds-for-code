export interface IPromiseInfo<T> {
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

export default class PromiseInfo<T> implements IPromiseInfo<T> { 
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;

	constructor(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
		this.resolve = resolve;
		this.reject = reject;
	}
}
