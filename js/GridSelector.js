import Control from "ol/control/Control";

class GridSelector extends Control {

    static template = `
        <div id="grid-selector" class="ol-unselectable ol-control">
            <div class="selected-row">
                <p class="selected-label">Grids</p>
                <button id="grid-selector-button">#</button>
            </div>
            <div id="grid-selector-list" class="hidden"></div>
        </div>
    `;

    constructor(options) {
        const element = document.createRange().createContextualFragment(GridSelector.template);

        super({
            element: element.getElementById('grid-selector'),
            target: options.target
        });

        this.map = options.map;
        this.gridLayers = options.gridLayers || [];

        this.listElement = element.getElementById('grid-selector-list');
        const toggleButton = element.getElementById('grid-selector-button');

        toggleButton.addEventListener('click', () => {
            this.listElement.classList.toggle('hidden');
        });

        this.renderList();
    }
    
    setGridLayers(gridLayers) {
        this.gridLayers = gridLayers;
        this.renderList();
    }

    renderList() {
        this.listElement.innerHTML = '';
        this.gridLayers.forEach(layer => {
            const name = layer.get('gridName') || layer.get('gridId');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = layer.getVisible();

            checkbox.addEventListener('change', () => {
                layer.setVisible(checkbox.checked);
            });

            const label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + name));

            this.listElement.appendChild(label);
            this.listElement.appendChild(document.createElement('br'));
        });
    }
}

export default GridSelector;
