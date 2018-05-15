class MusicalScale{

  constructor( params ) {

    this.rootNote = params.rootNote || "A4";

    this.majorScaleCents = [0,200,400,500,700,900,1100,1200];
    this.minorScaleCents = [0,200,300,500,700,800,1000,1200];

    this.majorScaleIntervals = [0,2,4,5,7,9,11,12];
    this.minorScaleIntervals = [0,2,3,5,7,8,10,12];

    this.scale = "major" || params.scale; 

    this.frequencies = [16.35,17.32,18.35,19.45,20.6,21.83,23.12,24.5,25.96,27.5,29.14,30.87,32.7,34.65,36.71,38.89,41.2,43.65,46.25,49,51.91,55,58.27,61.74,65.41,69.3,73.42,77.78,82.41,87.31,92.5,98,103.83,110,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.94,261.63,277.18,293.66,311.13,329.63,349.23,369.99,392,415.3,440,466.16,493.88,523.25,554.37,587.33,622.25,659.25,698.46,739.99,783.99,830.61,880,932.33,987.77,1046.5,1108.73,1174.66,1244.51,1318.51,1396.91,1479.98,1567.98,1661.22,1760,1864.66,1975.53,2093,2217.46,2349.32,2489.02,2637.02,2793.83,2959.96,3135.96,3322.44,3520,3729.31,3951.07,4186.01,4434.92,4698.63,4978.03,5274.04,5587.65,5919.91,6271.93,6644.88,7040,7458.62,7902.13];

    this.stepIndexByNote = {};
    this.stepIndexByNote["C0"] = 0;
    this.stepIndexByNote["C#0"] = 1;
    this.stepIndexByNote["D0"] = 2;
    this.stepIndexByNote["D#0"] = 3;
    this.stepIndexByNote["E0"] = 4;
    this.stepIndexByNote["F0"] = 5;
    this.stepIndexByNote["F#0"] = 6;
    this.stepIndexByNote["G0"] = 7;
    this.stepIndexByNote["G#0"] = 8;
    this.stepIndexByNote["A0"] = 9;
    this.stepIndexByNote["A#0"] = 10;
    this.stepIndexByNote["B0"] = 11;
    this.stepIndexByNote["C1"] = 12;
    this.stepIndexByNote["C#1"] = 13;
    this.stepIndexByNote["D1"] = 14;
    this.stepIndexByNote["D#1"] = 15;
    this.stepIndexByNote["E1"] = 16;
    this.stepIndexByNote["F1"] = 17;
    this.stepIndexByNote["F#1"] = 18;
    this.stepIndexByNote["G1"] = 19;
    this.stepIndexByNote["G#1"] = 20;
    this.stepIndexByNote["A1"] = 21;
    this.stepIndexByNote["A#1"] = 22;
    this.stepIndexByNote["B1"] = 23;
    this.stepIndexByNote["C2"] = 24;
    this.stepIndexByNote["C#2"] = 25;
    this.stepIndexByNote["D2"] = 26;
    this.stepIndexByNote["D#2"] = 27;
    this.stepIndexByNote["E2"] = 28;
    this.stepIndexByNote["F2"] = 29;
    this.stepIndexByNote["F#2"] = 30;
    this.stepIndexByNote["G2"] = 31;
    this.stepIndexByNote["G#2"] = 32;
    this.stepIndexByNote["A2"] = 33;
    this.stepIndexByNote["A#2"] = 34;
    this.stepIndexByNote["B2"] = 35;
    this.stepIndexByNote["C3"] = 36;
    this.stepIndexByNote["C#3"] = 37;
    this.stepIndexByNote["D3"] = 38;
    this.stepIndexByNote["D#3"] = 39;
    this.stepIndexByNote["E3"] = 40;
    this.stepIndexByNote["F3"] = 41;
    this.stepIndexByNote["F#3"] = 42;
    this.stepIndexByNote["G3"] = 43;
    this.stepIndexByNote["G#3"] = 44;
    this.stepIndexByNote["A3"] = 45;
    this.stepIndexByNote["A#3"] = 46;
    this.stepIndexByNote["B3"] = 47;
    this.stepIndexByNote["C4"] = 48;
    this.stepIndexByNote["C#4"] = 49;
    this.stepIndexByNote["D4"] = 50;
    this.stepIndexByNote["D#4"] = 51;
    this.stepIndexByNote["E4"] = 52;
    this.stepIndexByNote["F4"] = 53;
    this.stepIndexByNote["F#4"] = 54;
    this.stepIndexByNote["G4"] = 55;
    this.stepIndexByNote["G#4"] = 56;
    this.stepIndexByNote["A4"] = 57;
    this.stepIndexByNote["A#4"] = 58;
    this.stepIndexByNote["B4"] = 59;
    this.stepIndexByNote["C5"] = 60;
    this.stepIndexByNote["C#5"] = 61;
    this.stepIndexByNote["D5"] = 62;
    this.stepIndexByNote["D#5"] = 63;
    this.stepIndexByNote["E5"] = 64;
    this.stepIndexByNote["F5"] = 65;
    this.stepIndexByNote["F#5"] = 66;
    this.stepIndexByNote["G5"] = 67;
    this.stepIndexByNote["G#5"] = 68;
    this.stepIndexByNote["A5"] = 69;
    this.stepIndexByNote["A#5"] = 70;
    this.stepIndexByNote["B5"] = 71;
    this.stepIndexByNote["C6"] = 72;
    this.stepIndexByNote["C#6"] = 73;
    this.stepIndexByNote["D6"] = 74;
    this.stepIndexByNote["D#6"] = 75;
    this.stepIndexByNote["E6"] = 76;
    this.stepIndexByNote["F6"] = 77;
    this.stepIndexByNote["F#6"] = 78;
    this.stepIndexByNote["G6"] = 79;
    this.stepIndexByNote["G#6"] = 80;
    this.stepIndexByNote["A6"] = 81;
    this.stepIndexByNote["A#6"] = 82;
    this.stepIndexByNote["B6"] = 83;
    this.stepIndexByNote["C7"] = 84;
    this.stepIndexByNote["C#7"] = 85;
    this.stepIndexByNote["D7"] = 86;
    this.stepIndexByNote["D#7"] = 87;
    this.stepIndexByNote["E7"] = 88;
    this.stepIndexByNote["F7"] = 89;
    this.stepIndexByNote["F#7"] = 90;
    this.stepIndexByNote["G7"] = 91;
    this.stepIndexByNote["G#7"] = 92;
    this.stepIndexByNote["A7"] = 93;
    this.stepIndexByNote["A#7"] = 94;
    this.stepIndexByNote["B7"] = 95;
    this.stepIndexByNote["C8"] = 96;
    this.stepIndexByNote["C#8"] = 97;
    this.stepIndexByNote["D8"] = 98;
    this.stepIndexByNote["D#8"] = 99;
    this.stepIndexByNote["E8"] = 100;
    this.stepIndexByNote["F8"] = 101;
    this.stepIndexByNote["F#8"] = 102;
    this.stepIndexByNote["G8"] = 103;
    this.stepIndexByNote["G#8"] = 104;
    this.stepIndexByNote["A8"] = 105;
    this.stepIndexByNote["A#8"] = 106;
    this.stepIndexByNote["B8"] = 107;

    this.rootStepIndex = this.stepIndexByNote[ this.rootNote ] || 57;

  }
  
  getCents( value ) {

    let scaleInterval = value % 7;
    let octave = Math.floor( value / 7 );
    let cents = 0;

    switch( this.scale ) {
      case "major":
        cents = this.majorScaleCents[ scaleInterval ];
        break;

      case "minor":
        cents = this.minorScaleCents[ scaleInterval ];
        break;
    }

    return cents + ( 1200 * octave );

  }

  getFrequency( value ) {

    let scaleInterval = value % 7;
    let octave = Math.floor( value / 7 );
    let offset = 0;

    switch( this.scale ) {
      case "major":
        offset = this.majorScaleIntervals[ scaleInterval ];
        break;

      case "minor":
        offset = this.minorScaleIntervals[ scaleInterval ];
        break;
    }

    let f = this.frequencies[ this.rootStepIndex + offset + ( 12 * octave ) ]
    console.log(f)
    return f;

  }
  
}