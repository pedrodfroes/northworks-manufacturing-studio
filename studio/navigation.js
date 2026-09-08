export const areaSteps=[
 ['welcome','scope','architecture','industry','archetype','dialect','migration'],
 ['sop-design','sop'],['plm-design','plm'],['lims-design','lims'],['qms-design','qms'],['mrp-design','mrp'],
 ['master-purpose','master-policy','master-handoff'],
 ['calendar-gantt-intro','calendar','calendar-gantt-preview','bottleneck-intro','constraint','bottleneck-preview','areas','workcenters'],
 ['attr-classification','attr-descriptor','attr-planning','attr-variant','attr-batchSerial','attr-quality','bom','supplies'],
 ['tank-intro','volume-storage','tank-preview','transition-intro','transitions','transition-preview','workforce-intro','workforce','workforce-preview'],
 ['dispatch-purpose','dispatch-control','execution'],['variant','readiness'],['handoff']
];
export const sequence=areaSteps.flat();
export function adjacent(id,direction){return sequence[sequence.indexOf(id)+direction]||null;}
