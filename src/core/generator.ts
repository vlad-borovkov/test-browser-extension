import { toPascalCase, singularize } from './utils';
import { GeneratorOptions } from '../types/generator';

export class InterfaceGenerator {
    private interfaces: Map<string, string> = new Map();
    private options: GeneratorOptions;

    constructor(options: GeneratorOptions = {}) {
        this.options = {
            prefix: options.prefix || '',
            suffix: options.suffix || '',
        };
    }

    public generate(json: any, rootName: string = 'Root'): string {
        this.interfaces.clear();
        const rootInterfaceName = `${this.options.prefix}${toPascalCase(rootName)}${this.options.suffix}`;

        this.processValue(json, rootName, true);

        // Sort interfaces: root first, then the rest
        const result: string[] = [];
        const rootContent = this.interfaces.get(rootInterfaceName);
        if (rootContent) {
            result.push(`export default ${rootContent}`);
            this.interfaces.delete(rootInterfaceName);
        }

        for (const [_, content] of this.interfaces) {
            result.push(content);
        }

        return result.join('\n\n');
    }

    private processValue(value: any, key: string, isRoot: boolean = false): string {
        if (value === null) return 'null';

        const type = typeof value;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return type;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return 'unknown[]';

            // Analyze all elements for union types
            const types = new Set<string>();
            const itemName = singularize(key);

            value.forEach(item => {
                types.add(this.processValue(item, itemName));
            });

            const unionType = Array.from(types).join(' | ');
            return types.size > 1 ? `(${unionType})[]` : `${unionType}[]`;
        }

        if (type === 'object') {
            return this.createInterface(value, key, isRoot);
        }

        return 'any';
    }

    private createInterface(obj: any, name: string, isRoot: boolean): string {
        const interfaceName = isRoot
            ? `${this.options.prefix}${toPascalCase(name)}${this.options.suffix}`
            : toPascalCase(name);

        if (this.interfaces.has(interfaceName)) {
            return interfaceName;
        }

        let content = `interface ${interfaceName} {\n`;
        const entries = Object.entries(obj);

        for (const [key, value] of entries) {
            const fieldType = this.processValue(value, key);
            content += `  ${key}: ${fieldType};\n`;
        }

        content += `}`;
        this.interfaces.set(interfaceName, content);
        return interfaceName;
    }
}

export function generateDTO(json: any, rootName: string, options: GeneratorOptions = {}): string {
    const generator = new InterfaceGenerator(options);
    return generator.generate(json, rootName);
}
