export function capitalizeText(string) {
    let newString = '';

    for (let i = 0; i <= string.length; i++) {
        if (string[i] === string[0] || string[i - 1] === ' ' || string[i - 1] === '"' || string[i - 1] === '-') {
            newString += string.charAt(i);
        } else {
            newString += string.charAt(i).toLowerCase();
        }
    }

    return newString;
}