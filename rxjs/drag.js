(function(Rx) {

    'use strict';

    let selected = [];
    function select(selectors) {
        selectors.forEach(selector => {
            selected.push(document.querySelector(selector));
        });
    }

    function bindDrag(selector) {
        const el = document.querySelector(selector);
        let elCopy;
        const mouseDown$ = Rx.Observable.fromEvent(el, 'mousedown');
        const mouseUp$ = Rx.Observable.fromEvent(el, 'mouseup');
        const mouseOut$ = Rx.Observable.fromEvent(el, 'mouseout');
        const mouseMove$ = Rx.Observable.fromEvent(el, 'mousemove');
        const drag$ = mouseDown$.concatMap((startEvent)=> {
            elCopy = el.cloneNode(true);
            // document.getElementsByTagName('body')[0].append(elCopy);
            const initialLeft = el.offsetLeft;
            const initialTop = el.offsetTop;
            const stop$ = mouseUp$.merge(mouseOut$);
            return mouseMove$.takeUntil(stop$).map(moveEvent => {
                return {
                    x: moveEvent.x - startEvent.x + initialLeft,
                    y: moveEvent.y - startEvent.y + initialTop,
                };
            });
        });
        drag$.subscribe(event => {
            el.style.left = event.x + 'px';
            el.style.top = event.y + 'px';
        });
    }

    window.bindDrag = bindDrag;
})(Rx);