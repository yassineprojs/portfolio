// Define the screen size as an object with width and height properties.
const SCREEN_SIZE = { w: 1280, h: 1024 };

// Define padding for the iframe element.
const IFRAME_PADDING = 32;

// Calculate the iframe size by subtracting the padding from the screen size.
const IFRAME_SIZE = {
    w: SCREEN_SIZE.w - IFRAME_PADDING,
    h: SCREEN_SIZE.h - IFRAME_PADDING,
};

// Declare a class named MonitorScreen that extends EventEmitter.
export default class MonitorScreen extends EventEmitter {

    // Method to create an iframe within a container.
    createIframe() {
        
        // Create a div element to act as the container for the iframe.
        const container = document.createElement('div');
        // Set the container's width, height, opacity, and background color.
        container.style.width = this.screenSize.width + 'px';
        container.style.height = this.screenSize.height + 'px';
        container.style.opacity = '1';
        container.style.background = '#1d2e2f';

        // Create an iframe element.
        const iframe = document.createElement('iframe');

        // Define an onload event handler for the iframe.
        iframe.onload = () => {
            // Check if the iframe's content window is available.
            if (iframe.contentWindow) {
                // Listen for 'message' events from the iframe's content window.
                window.addEventListener('message', (event) => {
                    // Create a new custom event with the type from the received message.
                    var evt = new CustomEvent(event.data.type, {
                        bubbles: true,
                        cancelable: false,
                    });

                    // Add a property to the event indicating it originated in the computer.
                    evt.inComputer = true;

                    // Handle 'mousemove' events specifically.
                    if (event.data.type === 'mousemove') {
                        // Get the iframe's bounding rectangle.
                        var clRect = iframe.getBoundingClientRect();
                        // Destructure the top, left, width, and height properties from the bounding rectangle.
                        const { top, left, width, height } = clRect;
                        // Calculate the width and height ratios.
                        const widthRatio = width / IFRAME_SIZE.w;
                        const heightRatio = height / IFRAME_SIZE.h;

                        // Adjust the clientX and clientY properties of the event based on the ratios and bounding rectangle.
                        evt.clientX = Math.round(
                            event.data.clientX * widthRatio + left
                        );
                        evt.clientY = Math.round(
                            event.data.clientY * heightRatio + top
                        );
                    } else if (event.data.type === 'keydown' || event.data.type === 'keyup') {
                        // For 'keydown' and 'keyup' events, set the key property of the event.
                        evt.key = event.data.key;
                    }

                    // Dispatch the custom event on the iframe.
                    iframe.dispatchEvent(evt);
                });
            }
        };

        // Set the iframe's source to a URL.
        iframe.src = 'https://os.henryheffernan.com/';
        
        // Check for a 'dev' URL parameter and set the iframe's source accordingly.
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('dev')) {
            iframe.src = 'http://localhost:3000/';
        }

        // Set the iframe's width and height.
        iframe.style.width = this.screenSize.width + 'px';
        iframe.style.height = this.screenSize.height + 'px';
        // Append the iframe to the container.
        container.appendChild(iframe);

        // Call the createCssPlane method with the container as an argument.
        this.createCssPlane(container);
    }

    // Method to create a CSS 3D plane.
    createCssPlane(element: HTMLElement) {
        // Create a new CSS3DObject with the provided element.
        const object = new CSS3DObject(element);

        // Set the position and rotation of the object to match the MonitorScreen instance.
        object.position.copy(this.position);
        object.rotation.copy(this.rotation);

        // Add the object to the CSS scene.
        this.cssScene.add(object);

        // Create a transparent material for a THREE.js mesh.
        const material = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            opacity: 0,
            transparent: true,
            blending: THREE.NoBlending
        });

        // Create a plane geometry with the width and height of the screen size.
        const geometry = new THREE.PlaneGeometry(
            this.screenSize.width,
            this.screenSize.height
        );

        // Create a mes