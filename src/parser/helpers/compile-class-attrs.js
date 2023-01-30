"use strict";

const propMap = {
    size: {
        type: 'integer',
        unit: 'px',
        cssProperty: 'font-size'
    },
    weight: {
        type: 'string',
        cssProperty: 'font-weight'
    },
    height: {
        type: 'integer',
        unit: 'px',
        cssProperty: 'height'
    },
    width: {
        type: 'integer',
        unit: 'px',
        cssProperty: 'weight'
    },
    transform: {
        type: 'string',
        cssProperty: 'text-transform'
    },
    color: {
        type: 'string',
        cssProperty: 'color'
    },
    bgcolor: {
        type: 'string',
        cssProperty: 'background-color'
    }
};

export default function compileClassAttrs(compiler, className, defaults = {}) {

    const classes = compiler.get('classes');
    const properties = classes[className] || [];
    const css = defaults;

    properties.forEach(prop => {

        let cssProp = '';
        let type = 'string';

        if (propMap[prop[0]]) {

            type = propMap[prop[0]]['type'];
            cssProp = propMap[prop[0]]['cssProperty'];

            switch (type) {
                case 'string':
                    css[cssProp] = prop[1];
                    break;
                case 'integer':
                    const unit = (propMap[prop[0]]['unit'] ? 'px' : '');
                    css[cssProp] = parseInt(prop[1])+unit;
                    break;
            }
        }
    });

    let output = '';

    for (let prop in css) {
        output += `${prop}: ${css[prop]};`;
    }

    return output;
};
