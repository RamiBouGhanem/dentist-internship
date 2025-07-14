import React from 'react';
import ProcedureItem from './ProcedureItem';

const procedures = [
  { type: 'Endo', color: '#B22222' },           // Deep red (root canal treatment - pulp removal)
  { type: 'Filling', color: '#C0C0C0' },        // Silver/gray (amalgam/composite restoration)
  { type: 'Extraction', color: '#8B0000' },     // Dark red (to indicate removed tooth)
  { type: 'Implant', color: '#A9A9A9' },        // Metallic gray (titanium implant root)
  { type: 'Crown (Zirconia)', color: '#F5F5F5' }, // Pearl white (realistic ceramic crown)
  { type: 'CCM', color: '#90EE90' },            // Light green (base metal crown appearance)
  { type: 'Bridge', color: '#A0522D' },         // Saddle brown (connects crowns across gap)
  { type: 'Veneer', color: '#FFE4C4' },         // Beige (porcelain front layer)
  { type: 'Inlay', color: '#B8860B' },          // Dark gold (fits in cavity)
  { type: 'Onlay', color: '#DAA520' },          // Goldenrod (covers one cusp or more)
  { type: 'Pulpotomy', color: '#FF8C00' },      // Dark orange (partial pulp treatment)
  { type: 'Sealant', color: '#E0FFFF' },        // Light cyan / translucent blue (groove protector)
  { type: 'Ortho Band', color: '#4682B4' },     // Steel blue (metallic orthodontic bands)
  { type: 'Temporary', color: '#DCDCDC' },      // Gainsboro (pale gray temporary crowns)
  { type: 'Missing', color: '#000000' }         // Black (tooth is gone)
];



export default function Toolbar() {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {procedures.map((proc) => (
        <ProcedureItem key={proc.type} type={proc.type} color={proc.color} />
      ))}
    </div>
  );
}