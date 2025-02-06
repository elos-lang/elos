export default function camelToSnake(string: string): string {
    return string.replace(/([a-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};
