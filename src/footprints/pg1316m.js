// Kailh PG1316M "Ultra Low Profile" keyswitch ergogen footprint (narrow variant)
// Derived from the PG1316S footprint; geometry per Kailh datasheet CPG1316M01D02.
// Differences vs PG1316S: body 13.5x8.9 (vs 13.5x13), contact pads at y 1.70
// (vs 2.65), stab-leg holes at y +/-0.90 (vs +/-2.75), mounting pads at
// y +/-3.95 (vs +/-6). Horizontal geometry is identical.
// NOTE: per datasheet the LED can only be back-mounted (no front LED window).
//
// Nets:
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params: same as pg1316s (reversible, side, large_p1, square_p1, square_p2,
//    shift_p2, small_mp, mp_gnd, mp_net, pad_vias, mp_vias and via sizes).
//    No 3D model (no STEP file available for the M variant).
module.exports = {
  params: {
    designator: 'S',
    from: undefined,
    to: undefined,
    reversible: false,
    side: 'F',
    large_p1: false,
    square_p1: false,
    square_p2: false,
    shift_p2: true,
    small_mp: false,
    mp_gnd: false,
    mp_net: { type: 'net', value: 'GND' }, // You really should not change this; set mp_gnd to false instead, there's no other net you want it attached to
    pad_vias: false,
    pad_via_size: 1.2,
    pad_via_hole: 0.8,
    mp_vias: false,
    mp_via_size: 1.0,
    mp_via_hole: 0.6,
  },
  body: p => {
    const fp = [];
    const backside = (p.reversible || p.side === "B");
    const frontside = (p.reversible || p.side === "F");
    const flip = (backside && !frontside);

    if (!backside && !frontside) throw new Error('unsupported side: ' + p.side);
    if (p.mp_via_size < p.mp_via_hole + 0.1) p.mp_via_size = p.mp_via_hole + 0.1;
    if (p.pad_via_size < p.pad_via_hole + 0.1) p.mp_via_size = p.mp_via_hole + 0.1;

fp.push(`(footprint "PG1316M"`);
fp.push(p.at);
fp.push(`(layer "${(flip ? "B.Cu" : "F.Cu")}")`);
fp.push(`(property "Reference" "${p.ref}" ${p.ref_hide} (at 0 0 ${p.r}) (layer "${p.side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${flip ? " (justify mirror)" : ""}))`);

fp.push(`(attr smd)`);

// Drawings on F.Fab
fp.push(`(fp_rect (start -8 8) (end 8 -8) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);
fp.push(`(fp_rect (start -6.75 -4.45) (end 6.75 4.45) (stroke (width 0.1) (type default)) (fill none) (layer "F.Fab"))`);




// Holes for stabilizing legs, Front Side (side = 'F' and/or reversible = true)
if (frontside) {

  // These were the originals from Mike's kicad footprint. Changed to drilled holes to improve fabrication accuracy.
  // fp.push(`(fp_circle (center -5.8 2.75) (end -5.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  // fp.push(`(fp_circle (center 5.8 -2.75) (end 6.4 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);

  fp.push(`(pad "" np_thru_hole circle (at -5.8 0.9) (size 1 1) (drill 1) (layers "*.Cu" "*.Mask"))`);
  fp.push(`(pad "" np_thru_hole circle (at 5.8 -0.9) (size 1.2 1.2) (drill 1.2) (layers "*.Cu" "*.Mask"))`);
  

//Pad 1, Front Side; default net = 'from'
//If/elseif/else for pad config; inline conditionals for via config
  if (p.large_p1) {
    fp.push(`(pad "1" smd roundrect (at -1.55 1.7 ${p.r}) (size 3.25 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" smd roundrect (at -2.175 1.7 ${p.r}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`); 
  } else {
    fp.push(`(pad "1" smd rect (at -2.5 1.7 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

//Pad 2, Front Side; default net = 'to'
  if (p.square_p2) {
    fp.push(`(pad "2" smd roundrect (at 1.55 1.7 ${p.r}) (size 2 2) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" smd rect (at 1.775 1.7 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" smd rect (at 2.5 1.7 ${p.r}) (size 1.55 2) (layers "F.Cu" "F.Paste" "F.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }

//Front Side Mount Points, all labeled P3; no net
//Inline conditionals for smaller pad config
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "-6.05 -3.825" : "-6.35 -3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "-6.05 3.825" : "-6.35 3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "6.05 -3.825" : "6.35 -3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" smd roundrect (at ${p.small_mp ? "6.05 3.825" : "6.35 3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
}

// Holes for stabilizing legs, Back Side (side = 'B' and/or reversible = true)
if (backside) {
  // fp.push(`(fp_circle (center -5.8 -2.75) (end -5.2 -2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);
  // fp.push(`(fp_circle (center 5.8 2.75) (end 6.3 2.75) (stroke (width 0.1) (type default)) (fill none) (layer "Edge.Cuts"))`);

  fp.push(`(pad "" np_thru_hole circle (at -5.8 -0.9) (size 1 1) (drill 1) (layers "*.Cu" "*.Mask"))`);
  fp.push(`(pad "" np_thru_hole circle (at 5.8 0.9) (size 1.2 1.2) (drill 1.2) (layers "*.Cu" "*.Mask"))`);


//Pad 1, Back Side; default net = 'from'
  if (p.large_p1) {
    fp.push(`(pad "1" smd roundrect (at 1.55 1.7 ${p.r}) (size 3.25 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else if (p.square_p1) {
    fp.push(`(pad "1" smd roundrect (at 2.175 1.7 ${p.r}) (size 2 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.from})`);
  } else {
    fp.push(`(pad "1" smd rect (at 2.5 1.7 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.from})`);
  }

//Pad 2, Back Side; default net = 'to'
  if (p.square_p2) {
    fp.push(`(pad "2" smd roundrect (at -1.55 1.7 ${p.r}) (size 2 2) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45) ${p.to})`);
  } else if (p.shift_p2) {
    fp.push(`(pad "2" smd rect (at -1.775 1.7 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  } else {
    fp.push(`(pad "2" smd rect (at -2.5 1.7 ${p.r}) (size 1.55 2) (layers "B.Cu" "B.Paste" "B.Mask") (thermal_bridge_angle 45) ${p.to})`);
  }

//Back Side Mount Points, all labeled P3; no net
//Inline conditionals for smaller pad config
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 -3.825" : "-6.35 -3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "-6.05 3.825" : "-6.35 3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 -3.825" : "6.35 -3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);
  fp.push(`(pad "3" ${p.mp_vias ? 'thru_hole' : 'smd'} roundrect (at ${p.small_mp ? "6.05 3.825" : "6.35 3.95" } ${p.r}) (size ${p.small_mp ? "1.4 1.75" : "2 2"}) ${p.mp_vias ? `(drill ${p.mp_via_size})` : ''} (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.125) (thermal_bridge_angle 45))`);  
}

//Data Pad vias.
if (p.pad_vias) {
  if (frontside) { // Remember "frontside" includes reversable!
    if (p.large_p1) {
      fp.push(`(pad "1" thru_hole circle (at -1.55 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else if (p.square_p1) {
      fp.push(`(pad "1" thru_hole circle (at -2.175 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else {
      fp.push(`(pad "1" thru_hole circle (at -2.5 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    }
    if (p.square_p2) {
      fp.push(`(pad "2" thru_hole circle (at 1.55 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else if (p.shift_p2) {
      fp.push(`(pad "2" thru_hole circle (at 1.775 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else {
      fp.push(`(pad "2" thru_hole circle (at 2.5 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    }
  } else { //If it ain't frontside, must be backside ONLY 
    if (p.large_p1) {
      fp.push(`(pad "1" thru_hole circle (at 1.55 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else if (p.square_p1) {
      fp.push(`(pad "1" thru_hole circle (at 2.175 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    } else {
      fp.push(`(pad "1" thru_hole circle (at 2.5 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.from})`);
    }
    if (p.square_p2) {
      fp.push(`(pad "2" thru_hole circle (at -1.55 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else if (p.shift_p2) {
      fp.push(`(pad "2" thru_hole circle (at -1.775 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    } else {
      fp.push(`(pad "2" thru_hole circle (at -2.5 1.7 ${p.r}) (size ${p.pad_via_size} ${p.pad_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.pad_via_hole}) (thermal_bridge_angle 45) ${p.to})`);
    }
  }
}

//Mounting Point Vias
if (p.mp_vias) {
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "-6.05 -3.825" : "-6.35 -3.95" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "-6.05 3.825" : "-6.35 3.95" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "6.05 -3.825" : "6.35 -3.95" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
  fp.push(`(pad "3" thru_hole circle (at ${p.small_mp ? "6.05 3.825" : "6.35 3.95" } ${p.r}) (size ${p.mp_via_size} ${p.mp_via_size}) (layers "F.Cu" "B.Cu" "F.Paste" "B.Paste" "F.Mask" "B.Mask") (drill ${p.mp_via_hole}) (thermal_bridge_angle 45) ${p.mp_gnd ? `${p.mp_net}` : ''})`);
}


    fp.push(')');
    return fp.join('\n');
  }
}