class Analyser {
    
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.analyser = audioContext.createAnalyser();
    
    this.analyser.fftSize = options.fftSize || 512;

    this.bufferLength = this.analyser.frequencyBinCount;
    
    this.dataArray = new Uint8Array( this.bufferLength );

    this.input = this.analyser;

  }

  getWaveformData() {

    this.analyser.getByteTimeDomainData( this.dataArray );
    return this.dataArray;

  }

  getFrequencyData() {

    this.analyser.getByteFrequencyDat( this.dataArray );
    return this.dataArray;

  }

}