// https://stackoverflow.com/questions/49245168/zoom-in-out-at-mouse-position-in-canvas
const controls = {
    view: {
        x: 0,
        y: 0,
        zoom: 1
    },
    viewPos: {
        prevX: null,
        prevY: null,
        isDragging: false
    }
};

class Controls {
    static move(controls) {
        function mousePressed(e) {
            controls.viewPos.isDragging = true;
            controls.viewPos.prevX = e.clientX;
            controls.viewPos.prevY = e.clientY;
        }

        function mouseDragged(e) {
            const { prevX, prevY, isDragging } = controls.viewPos;
            if(!isDragging) return;

            const pos = {
                x: e.clientX,
                y: e.clientY
            };
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;

            if(prevX || prevY) {
                controls.view.x += dx;
                controls.view.y += dy;
                controls.viewPos.prevX = pos.x;
                controls.viewPos.prevY = pos.y;
            }
        }

        function mouseReleased() {
            controls.viewPos.isDragging = false;
            controls.viewPos.prevX = null;
            controls.viewPos.prevY = null;
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoom(controls) {
        function worldZoom(e) {
            const { x, y, deltaY } = e;
            const direction = deltaY > 0 ? -1 : 1;
            const factor = 0.1;
            let zoom = direction * factor;

            const maxZoom = 3;
            const minZoom = 0.3;
            // constrain(zoomSettings.factor, 0.33, 9.00);
            // this.sensitivity = 0.005;


            const wx = (x - controls.view.x) / (width * controls.view.zoom);
            const wy = (y - controls.view.y) / (height * controls.view.zoom);

            if (controls.view.zoom + zoom > maxZoom) {
                return;
            }
            if (controls.view.zoom + zoom < minZoom) {
                return;
            }

            controls.view.x -= wx * width * zoom;
            controls.view.y -= wy * height * zoom;
            controls.view.zoom += zoom;
        }

        return { worldZoom };
    }
}