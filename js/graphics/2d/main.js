{
    window.onload = () => {
        let workers = [];
        for(let i = 0; i < navigator.hardwareConcurrency; i++){
            workers.push(new Worker("../js/graphics/2d/noise.js"));
        }

        const cellCanvas = document.querySelector("#cell-noise");
        let rowWidth = cellCanvas.width/workers.length;

        for(let i = 0; i < workers.length; i++){
            workers[i].postMessage({
                row: i,
                noise: 'cell',
                width: cellCanvas.width,
                height: cellCanvas.height,
                rowWidth: rowWidth
            });
        }
    };
}