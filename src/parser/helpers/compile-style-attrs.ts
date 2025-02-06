import Compiler from "../../compiler/Compiler";

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
    },
    rounded: {
        type: 'integer',
        unit: 'px',
        cssProperty: 'border-radius'
    },
    padding: {
        type: 'integer',
        unit: 'px',
        cssProperty: 'padding'
    },
    align: {
        type: 'string',
        cssProperty: 'text-align'
    }
};

export default {
    compileStyleAttrs(compiler: Compiler, ident: string, className: string = null, defaults = {}) {

        const name = (className ? className : ident);
        const styles = (className ? compiler.get('classes') : compiler.get('identStyles'));
        const properties = styles[name] || [];
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

        return css;
    },
    attrsToCssString(cssProps) {
        let output = '';

        for (let prop in cssProps) {
            output += `${prop}: ${cssProps[prop]};`;
        }

        return output;
    }
};
