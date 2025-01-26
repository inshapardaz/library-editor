const applyCorrections = (text, corrections) => {
    corrections.forEach(({ incorrect, correct, wholeWord = false }) => {
        if (wholeWord) {
            const regex = new RegExp(`\\b${incorrect}\\b`, 'gui');
            text = text.replace(regex, correct);
        } else {
            const regex = new RegExp(incorrect, 'gui');
            text = text.replace(regex, correct);
        }
    });
    return text;
}


export default applyCorrections;