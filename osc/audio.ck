// Create OSC receiver.
OscRecv OSCin;
3334 => OSCin.port;
OSCin.listen();

// Define OSC events.
OSCin.event("/create,f") @=> OscEvent create_event;
OSCin.event("/split,f") @=> OscEvent split_event;

45 => int baseMidi;
// Pentatonic scale.
[0, 2, 4, 7, 9, 12, 14, 16] @=> int offsets[];

fun void receiveCreate() {
    while(true) {
        create_event => now;
        while (create_event.nextMsg() != 0) {
            Std.mtof(baseMidi + offsets[Math.random2(0,7)]) => float freq;            
            spork~ playHighNote(0.05, freq);
        }
    }
}

fun void receiveSplit() {
    while(true) {
        split_event => now;
        while (split_event.nextMsg() != 0) {
            Std.mtof(baseMidi + offsets[Math.random2(0,7)]) => float freq;            
            spork~ playHighNote(0.05, freq);
        }
    }
}

// Some background noise
fun void playBackgroundNoise(float baseFreq) {
    Noise n => LPF f => Gain g => Envelope e => dac;
    e.duration(100::ms);
    f.freq(100);
    g.gain(0.025);
    SinOsc s => JCRev rev => LPF f2 => Gain g2 => e => dac;
    g2.gain(0.05);
    f2.freq(200);
    s.freq(baseFreq);
    
    e.keyOn();
    while(true) {
        s.freq(baseFreq + Math.random2f(-5, 5));
        5::ms => now;
    }
    
    e.keyOff();
    200::ms => now;
}

fun void drops() {
    // Derived from shake-o-matic example 
    
    Shakers shake => LPF filter => JCRev r => dac;
    1. => r.mix;
    
    filter.freq(880);
    
    while(true) {
        // change shaker
        if(Math.randomf() > 0.8) {
            Math.random2(0, 22) => shake.which;
            Std.mtof(Math.random2f(0.0, 128.0)) => shake.freq;
            Math.random2f(0, 128) => shake.objects;
        }
        
        // shake it!
        Math.random2f(0.8, 1.3) => shake.noteOn;
        
        if (Math.randomf() > 0.9){ 
            1::second => now;
        } else if(Math.randomf() > .925) {
            250::ms => now;
        } else if(Math.randomf() > .05) {
            .125::second => now;
        } else {
            1 => int pick_dir;
            // how many times
            4 * Math.random2(1, 5) => int pick;
            0.0 => float pluck;
            0.7 / pick => float inc;
            // time loop
            for(0 => int i; i < pick; i++)
            {
                75::ms => now;
                Math.random2f(.2, .3) + i*inc => pluck;
                pluck + -.2 * pick_dir => shake.noteOn;
                // simulate pluck direction
                !pick_dir => pick_dir;
            }
            
            // let time pass for final shake
            75::ms => now;
        }
    }
}

fun void playHighNote(float gain, float baseFreq) {
    SinOsc s => JCRev r => ADSR e => Gain g => dac;
    g.gain(gain);
    
    e.attackTime(30::ms);
    e.decayTime(30::ms);
    e.sustainLevel(0.1);
    e.releaseTime(2::second);
    
    s.freq(baseFreq * 10);
    
    e.keyOn();
    300::ms => now;
    e.keyOff();
    2::second => now;
}

// Begin receiving events.
spork~ receiveCreate();
spork~ receiveSplit();

// Background Track
spork~ playBackgroundNoise(55);
spork~ playBackgroundNoise(220);
spork~ playBackgroundNoise(440);
spork~ drops();
while (true) {
    1::ms => now;
}