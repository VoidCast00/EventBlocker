//define events to block
const blockedEvents = new Set([
    //clipboard, text sellection
    'copy', 'paste', 'cut',
    'beforecopy', 'beforecut', 'beforepaste',
    'select',

    //mouse, pointer tracking, movement, clicks, hovering
    'pointerdown', 'pointerup', 'pointermove',
    'mousemove', 'mouseenter', 'mouseleave',
    'mouseover', 'mouseout',
    'contextmenu',

    //window, alt tab, focus,visibility, resizing
    'visibilitychange', 
    'blur','focus','focusin','focusout',
    'pagehide','pageshow',
    'resize','fullscreenchange'
]);


//create a factory function to generate patched addEventListener (EL)
function patchAddEL(originalFunction) {
    //              name, callback, config
    return function(type, listener, options) {
        if (blockedEvents.has(type)) {
            console.log(`[EventBlocker] blocked event: ${type}`);
            return; // fuck that EL
        }
        
        //if not blocked call the original function
        return originalFunction.apply(this, arguments);
    };
}

//patch the targets:

//patch the base class EventTarget
if (typeof EventTarget !== 'undefined' && EventTarget.prototype.addEventListener) {
    EventTarget.prototype.addEventListener = patchAddEL(EventTarget.prototype.addEventListener);
}


// AI explanation << In JS, window and document don't have their own addEventListener 
//                  they inherit it. Assigning it directly creates an "own property" that shadows the prototype.>>

if (typeof window !== 'undefined') {
    window.addEventListener = patchAddEL(window.addEventListener);
}

if (typeof document !== 'undefined') {
    document.addEventListener = patchAddEL(document.addEventListener);
}

if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype.addEventListener) {
    HTMLElement.prototype.addEventListener = patchAddEL(HTMLElement.prototype.addEventListener);
}

console.log("[EventBlocker] patched event listeners");