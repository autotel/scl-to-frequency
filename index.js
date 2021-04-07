// Influenced by Scala.lua
// http://forum.renoise.com/index.php/topic/28495-snippet-load-scala-scl-tuning-file/
// Scala Format: http://www.huygens-fokker.org/scala/scl_format.html

'use strict';

let description = '';

let readString = (string, baseNote = 0, baseFrequency = 1) => {
    let lines = string.split('\n');
    let tunings = [];
    let counter = 0;
    if (string) {
        for (let i = 0, ln = lines.length; i < ln; i++) {
            if (lines[i].substring(0,1) !== '!' && lines[i].replace(/\s/g, '')) {
                counter++;
                if (counter === 1) description = lines[i];
                if (counter > 2) {
                    if (lines[i].match(/^.*\./)) {
                        let cents = lines[i].replace(/\s/g, '');
                        tunings.push(Math.pow(2, cents / 1200));
                    } else if (lines[i].match(/[0-9]\/[0-9]/)) {
                        let ratio = lines[i].split('/');
                        tunings.push(ratio[0] / ratio[1]);
                    } else {
                        tunings.push(lines[i]);
                    }
                }
            }
        }
    }
    return tuningToFrequencies(tunings, baseNote, baseFrequency);
}

let tuningToFrequencies = (tuning, baseNote, baseFrequency) => {
    let notesPerOctave = Object.keys(tuning).length;
    let frequencies = [];
    for (let i = 0; i < 128; i++) {
        let note = i - baseNote;
        let degree = Math.abs(note % notesPerOctave);
        let octave = Math.floor(note / notesPerOctave);
        let frequency = baseFrequency * Math.pow(tuning[notesPerOctave - 1], 
                (octave * notesPerOctave) / notesPerOctave);
        if (degree > 0) frequency *= tuning[degree - 1];
        frequency = Math.max(0.0, Math.min(22050.0, frequency));
        frequencies.push(frequency);
    }
    return frequencies.sort((a, b) => a - b);
}

export default {
    readString,
    tuningToFrequencies,
};

