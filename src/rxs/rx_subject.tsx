export interface RxSubscription {
    cancel: () => void;
}

export interface RxSubject<T> {
    sink(data: T): void;
    subscribe(next: (data: T) => void): RxSubscription;
}

class _RxSubscription<T> implements RxSubscription {
    _callback: (data: T) => void;
    _observer: _RxSubject<T>;

    constructor(observer: _RxSubject<T>, nextCallback: (data: T) => void) {
        this._observer = observer;
        this._callback = nextCallback;
    }

    _next = (data: T) => {
        this._callback(data);
    }

    cancel = () => {
        this._observer._cancelSubscription(this);
    }
}

class _RxSubject<T> implements RxSubject<T> {
    private _subscriptions: _RxSubscription<T>[] = [];
    private _initialized: boolean = false;
    private _pendingData?: T;

    static instance<T>(): RxSubject<T> {
        return new _RxSubject<T>();
    }

    sink(data: T): void {
        if (!this._initialized) {
            this._pendingData = data;
        }
        this._subscriptions.forEach((sub) => sub._next(data));
    }

    subscribe(next: (data: T) => void): RxSubscription {        
        const subscription = new _RxSubscription(this, next);
        this._subscriptions.push(subscription);
        if (!this._initialized && this._pendingData) {
            subscription._next(this._pendingData!);
        }
        this._initialized = true;
        return subscription;
    }

    _cancelSubscription = (subscription: _RxSubscription<T>) => {
        const index = this._subscriptions.indexOf(subscription);
        if (index >= 0) {
            this._subscriptions.splice(index, 1);
        }
    }
}
function instanceRxSubject<T>(): RxSubject<T> { return _RxSubject.instance<T>(); }
export default instanceRxSubject;
