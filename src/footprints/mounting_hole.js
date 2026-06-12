// Plated mounting hole (default M2: 2.2 mm drill, 4.0 mm annular pad)
module.exports = {
  params: {
    designator: 'MH',
    drill: 2.2,
    size: 4.0,
  },
  body: p => `
    (footprint "mounting_hole"
      ${p.at}
      (attr exclude_from_pos_files exclude_from_bom)
      (pad "" thru_hole circle (at 0 0) (size ${p.size} ${p.size}) (drill ${p.drill}) (layers "*.Cu" "*.Mask"))
    )
  `
}
