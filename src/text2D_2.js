import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three';

function createText( message) {
    const canvas = document.createElement( 'canvas' );
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext( '2d' );

    context.fillStyle = '#00000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'normal 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff';
    context.fillText( message, canvas.width / 2, canvas.height / 2 );

    const texture = new Texture( canvas );
    texture.needsUpdate = true;

    const material = new MeshBasicMaterial( {
        side: DoubleSide,
        map: texture,
        transparent: true,
    });
    const geometry = new PlaneGeometry( 0.1, 0.1 );

    const plane = new Mesh( geometry, material );
    return plane;

}
    
export { createText };