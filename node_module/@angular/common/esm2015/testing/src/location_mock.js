/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, Injectable } from '@angular/core';
/**
 * A spy for {@link Location} that allows tests to fire simulated location events.
 *
 * @publicApi
 */
export class SpyLocation {
    constructor() {
        this.urlChanges = [];
        this._history = [new LocationState('', '', null)];
        this._historyIndex = 0;
        /** @internal */
        this._subject = new EventEmitter();
        /** @internal */
        this._baseHref = '';
        /** @internal */
        this._platformStrategy = null;
        /** @internal */
        this._platformLocation = null;
        /** @internal */
        this._urlChangeListeners = [];
    }
    setInitialPath(url) {
        this._history[this._historyIndex].path = url;
    }
    setBaseHref(url) {
        this._baseHref = url;
    }
    path() {
        return this._history[this._historyIndex].path;
    }
    getState() {
        return this._history[this._historyIndex].state;
    }
    isCurrentPathEqualTo(path, query = '') {
        const givenPath = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
        const currPath = this.path().endsWith('/') ? this.path().substring(0, this.path().length - 1) : this.path();
        return currPath == givenPath + (query.length > 0 ? ('?' + query) : '');
    }
    simulateUrlPop(pathname) {
        this._subject.emit({ 'url': pathname, 'pop': true, 'type': 'popstate' });
    }
    simulateHashChange(pathname) {
        // Because we don't prevent the native event, the browser will independently update the path
        this.setInitialPath(pathname);
        this.urlChanges.push('hash: ' + pathname);
        this._subject.emit({ 'url': pathname, 'pop': true, 'type': 'hashchange' });
    }
    prepareExternalUrl(url) {
        if (url.length > 0 && !url.startsWith('/')) {
            url = '/' + url;
        }
        return this._baseHref + url;
    }
    go(path, query = '', state = null) {
        path = this.prepareExternalUrl(path);
        if (this._historyIndex > 0) {
            this._history.splice(this._historyIndex + 1);
        }
        this._history.push(new LocationState(path, query, state));
        this._historyIndex = this._history.length - 1;
        const locationState = this._history[this._historyIndex - 1];
        if (locationState.path == path && locationState.query == query) {
            return;
        }
        const url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push(url);
        this._subject.emit({ 'url': url, 'pop': false });
    }
    replaceState(path, query = '', state = null) {
        path = this.prepareExternalUrl(path);
        const history = this._history[this._historyIndex];
        if (history.path == path && history.query == query) {
            return;
        }
        history.path = path;
        history.query = query;
        history.state = state;
        const url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push('replace: ' + url);
    }
    forward() {
        if (this._historyIndex < (this._history.length - 1)) {
            this._historyIndex++;
            this._subject.emit({ 'url': this.path(), 'state': this.getState(), 'pop': true });
        }
    }
    back() {
        if (this._historyIndex > 0) {
            this._historyIndex--;
            this._subject.emit({ 'url': this.path(), 'state': this.getState(), 'pop': true });
        }
    }
    onUrlChange(fn) {
        this._urlChangeListeners.push(fn);
        if (!this._urlChangeSubscription) {
            this._urlChangeSubscription = this.subscribe(v => {
                this._notifyUrlChangeListeners(v.url, v.state);
            });
        }
    }
    /** @internal */
    _notifyUrlChangeListeners(url = '', state) {
        this._urlChangeListeners.forEach(fn => fn(url, state));
    }
    subscribe(onNext, onThrow, onReturn) {
        return this._subject.subscribe({ next: onNext, error: onThrow, complete: onReturn });
    }
    normalize(url) {
        return null;
    }
}
SpyLocation.decorators = [
    { type: Injectable }
];
class LocationState {
    constructor(path, query, state) {
        this.path = path;
        this.query = query;
        this.state = state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fbW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0aW5nL3NyYy9sb2NhdGlvbl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3ZEOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sV0FBVztJQUR4QjtRQUVFLGVBQVUsR0FBYSxFQUFFLENBQUM7UUFDbEIsYUFBUSxHQUFvQixDQUFDLElBQUksYUFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RCxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUNsQyxnQkFBZ0I7UUFDaEIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGdCQUFnQjtRQUNoQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGdCQUFnQjtRQUNoQixzQkFBaUIsR0FBcUIsSUFBSyxDQUFDO1FBQzVDLGdCQUFnQjtRQUNoQixzQkFBaUIsR0FBcUIsSUFBSyxDQUFDO1FBQzVDLGdCQUFnQjtRQUNoQix3QkFBbUIsR0FBOEMsRUFBRSxDQUFDO0lBc0h0RSxDQUFDO0lBbEhDLGNBQWMsQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDL0MsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFXO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDaEQsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUks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OUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVc7UUFDbkIsT0FBTyxJQUFLLENBQUM7SUFDZixDQUFDOzs7WUFuSUYsVUFBVTs7QUFzSVgsTUFBTSxhQUFhO0lBQ2pCLFlBQW1CLElBQVksRUFBUyxLQUFhLEVBQVMsS0FBVTtRQUFyRCxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQUs7SUFBRyxDQUFDO0NBQzdFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TG9jYXRpb24sIExvY2F0aW9uU3RyYXRlZ3ksIFBsYXRmb3JtTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0V2ZW50RW1pdHRlciwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbkxpa2V9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEEgc3B5IGZvciB7QGxpbmsgTG9jYXRpb259IHRoYXQgYWxsb3dzIHRlc3RzIHRvIGZpcmUgc2ltdWxhdGVkIGxvY2F0aW9uIGV2ZW50cy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTcHlMb2NhdGlvbiBpbXBsZW1lbnRzIExvY2F0aW9uIHtcbiAgdXJsQ2hhbmdlczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfaGlzdG9yeTogTG9jYXRpb25TdGF0ZVtdID0gW25ldyBMb2NhdGlvblN0YXRlKCcnLCAnJywgbnVsbCldO1xuICBwcml2YXRlIF9oaXN0b3J5SW5kZXg6IG51bWJlciA9IDA7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N1YmplY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAvKiogQGludGVybmFsICovXG4gIF9iYXNlSHJlZjogc3RyaW5nID0gJyc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BsYXRmb3JtU3RyYXRlZ3k6IExvY2F0aW9uU3RyYXRlZ3kgPSBudWxsITtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGxhdGZvcm1Mb2NhdGlvbjogUGxhdGZvcm1Mb2NhdGlvbiA9IG51bGwhO1xuICAvKiogQGludGVybmFsICovXG4gIF91cmxDaGFuZ2VMaXN0ZW5lcnM6ICgodXJsOiBzdHJpbmcsIHN0YXRlOiB1bmtub3duKSA9PiB2b2lkKVtdID0gW107XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VybENoYW5nZVN1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbkxpa2U7XG5cbiAgc2V0SW5pdGlhbFBhdGgodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaXN0b3J5W3RoaXMuX2hpc3RvcnlJbmRleF0ucGF0aCA9IHVybDtcbiAgfVxuXG4gIHNldEJhc2VIcmVmKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5fYmFzZUhyZWYgPSB1cmw7XG4gIH1cblxuICBwYXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4XS5wYXRoO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogdW5rbm93biB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4XS5zdGF0ZTtcbiAgfVxuXG4gIGlzQ3VycmVudFBhdGhFcXVhbFRvKHBhdGg6IHN0cmluZywgcXVlcnk6IHN0cmluZyA9ICcnKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZ2l2ZW5QYXRoID0gcGF0aC5lbmRzV2l0aCgnLycpID8gcGF0aC5zdWJzdHJpbmcoMCwgcGF0aC5sZW5ndGggLSAxKSA6IHBhdGg7XG4gICAgY29uc3QgY3VyclBhdGggPVxuICAgICAgICB0aGlzLnBhdGgoKS5lbmRzV2l0aCgnLycpID8gdGhpcy5wYXRoKCkuc3Vic3RyaW5nKDAsIHRoaXMucGF0aCgpLmxlbmd0aCAtIDEpIDogdGhpcy5wYXRoKCk7XG5cbiAgICByZXR1cm4gY3VyclBhdGggPT0gZ2l2ZW5QYXRoICsgKHF1ZXJ5Lmxlbmd0aCA+IDAgPyAoJz8nICsgcXVlcnkpIDogJycpO1xuICB9XG5cbiAgc2ltdWxhdGVVcmxQb3AocGF0aG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3N1YmplY3QuZW1pdCh7J3VybCc6IHBhdGhuYW1lLCAncG9wJzogdHJ1ZSwgJ3R5cGUnOiAncG9wc3RhdGUnfSk7XG4gIH1cblxuICBzaW11bGF0ZUhhc2hDaGFuZ2UocGF0aG5hbWU6IHN0cmluZykge1xuICAgIC8vIEJlY2F1c2Ugd2UgZG9uJ3QgcHJldmVudCB0aGUgbmF0aXZlIGV2ZW50LCB0aGUgYnJvd3NlciB3aWxsIGluZGVwZW5kZW50bHkgdXBkYXRlIHRoZSBwYXRoXG4gICAgdGhpcy5zZXRJbml0aWFsUGF0aChwYXRobmFtZSk7XG4gICAgdGhpcy51cmxDaGFuZ2VzLnB1c2goJ2hhc2g6ICcgKyBwYXRobmFtZSk7XG4gICAgdGhpcy5fc3ViamVjdC5lbWl0KHsndXJsJzogcGF0aG5hbWUsICdwb3AnOiB0cnVlLCAndHlwZSc6ICdoYXNoY2hhbmdlJ30pO1xuICB9XG5cbiAgcHJlcGFyZUV4dGVybmFsVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodXJsLmxlbmd0aCA+IDAgJiYgIXVybC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHVybCA9ICcvJyArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Jhc2VIcmVmICsgdXJsO1xuICB9XG5cbiAgZ28ocGF0aDogc3RyaW5nLCBxdWVyeTogc3RyaW5nID0gJycsIHN0YXRlOiBhbnkgPSBudWxsKSB7XG4gICAgcGF0aCA9IHRoaXMucHJlcGFyZUV4dGVybmFsVXJsKHBhdGgpO1xuXG4gICAgaWYgKHRoaXMuX2hpc3RvcnlJbmRleCA+IDApIHtcbiAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3RvcnlJbmRleCArIDEpO1xuICAgIH1cbiAgICB0aGlzLl9oaXN0b3J5LnB1c2gobmV3IExvY2F0aW9uU3RhdGUocGF0aCwgcXVlcnksIHN0YXRlKSk7XG4gICAgdGhpcy5faGlzdG9yeUluZGV4ID0gdGhpcy5faGlzdG9yeS5sZW5ndGggLSAxO1xuXG4gICAgY29uc3QgbG9jYXRpb25TdGF0ZSA9IHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4IC0gMV07XG4gICAgaWYgKGxvY2F0aW9uU3RhdGUucGF0aCA9PSBwYXRoICYmIGxvY2F0aW9uU3RhdGUucXVlcnkgPT0gcXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSBwYXRoICsgKHF1ZXJ5Lmxlbmd0aCA+IDAgPyAoJz8nICsgcXVlcnkpIDogJycpO1xuICAgIHRoaXMudXJsQ2hhbmdlcy5wdXNoKHVybCk7XG4gICAgdGhpcy5fc3ViamVjdC5lbWl0KHsndXJsJzogdXJsLCAncG9wJzogZmFsc2V9KTtcbiAgfVxuXG4gIHJlcGxhY2VTdGF0ZShwYXRoOiBzdHJpbmcsIHF1ZXJ5OiBzdHJpbmcgPSAnJywgc3RhdGU6IGFueSA9IG51bGwpIHtcbiAgICBwYXRoID0gdGhpcy5wcmVwYXJlRXh0ZXJuYWxVcmwocGF0aCk7XG5cbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5faGlzdG9yeVt0aGlzLl9oaXN0b3J5SW5kZXhdO1xuICAgIGlmIChoaXN0b3J5LnBhdGggPT0gcGF0aCAmJiBoaXN0b3J5LnF1ZXJ5ID09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGlzdG9yeS5wYXRoID0gcGF0aDtcbiAgICBoaXN0b3J5LnF1ZXJ5ID0gcXVlcnk7XG4gICAgaGlzdG9yeS5zdGF0ZSA9IHN0YXRlO1xuXG4gICAgY29uc3QgdXJsID0gcGF0aCArIChxdWVyeS5sZW5ndGggPiAwID8gKCc/JyArIHF1ZXJ5KSA6ICcnKTtcbiAgICB0aGlzLnVybENoYW5nZXMucHVzaCgncmVwbGFjZTogJyArIHVybCk7XG4gIH1cblxuICBmb3J3YXJkKCkge1xuICAgIGlmICh0aGlzLl9oaXN0b3J5SW5kZXggPCAodGhpcy5faGlzdG9yeS5sZW5ndGggLSAxKSkge1xuICAgICAgdGhpcy5faGlzdG9yeUluZGV4Kys7XG4gICAgICB0aGlzLl9zdWJqZWN0LmVtaXQoeyd1cmwnOiB0aGlzLnBhdGgoKSwgJ3N0YXRlJzogdGhpcy5nZXRTdGF0ZSgpLCAncG9wJzogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnlJbmRleCA+IDApIHtcbiAgICAgIHRoaXMuX2hpc3RvcnlJbmRleC0tO1xuICAgICAgdGhpcy5fc3ViamVjdC5lbWl0KHsndXJsJzogdGhpcy5wYXRoKCksICdzdGF0ZSc6IHRoaXMuZ2V0U3RhdGUoKSwgJ3BvcCc6IHRydWV9KTtcbiAgICB9XG4gIH1cbiAgb25VcmxDaGFuZ2UoZm46ICh1cmw6IHN0cmluZywgc3RhdGU6IHVua25vd24pID0+IHZvaWQpIHtcbiAgICB0aGlzLl91cmxDaGFuZ2VMaXN0ZW5lcnMucHVzaChmbik7XG5cbiAgICBpZiAoIXRoaXMuX3VybENoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fdXJsQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmUodiA9PiB7XG4gICAgICAgIHRoaXMuX25vdGlmeVVybENoYW5nZUxpc3RlbmVycyh2LnVybCwgdi5zdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9ub3RpZnlVcmxDaGFuZ2VMaXN0ZW5lcnModXJsOiBzdHJpbmcgPSAnJywgc3RhdGU6IHVua25vd24pIHtcbiAgICB0aGlzLl91cmxDaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmbiA9PiBmbih1cmwsIHN0YXRlKSk7XG4gIH1cblxuICBzdWJzY3JpYmUoXG4gICAgICBvbk5leHQ6ICh2YWx1ZTogYW55KSA9PiB2b2lkLCBvblRocm93PzogKChlcnJvcjogYW55KSA9PiB2b2lkKXxudWxsLFxuICAgICAgb25SZXR1cm4/OiAoKCkgPT4gdm9pZCl8bnVsbCk6IFN1YnNjcmlwdGlvbkxpa2Uge1xuICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnN1YnNjcmliZSh7bmV4dDogb25OZXh0LCBlcnJvcjogb25UaHJvdywgY29tcGxldGU6IG9uUmV0dXJufSk7XG4gIH1cblxuICBub3JtYWxpemUodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBudWxsITtcbiAgfVxufVxuXG5jbGFzcyBMb2NhdGlvblN0YXRlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHBhdGg6IHN0cmluZywgcHVibGljIHF1ZXJ5OiBzdHJpbmcsIHB1YmxpYyBzdGF0ZTogYW55KSB7fVxufVxuIl19