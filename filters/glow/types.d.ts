/// <reference types="pixi.js" />
declare module "@pixi/filter-glow" {
    export class GlowFilter extends PIXI.Filter {
        constructor(options?:GlowFilterOptions);
        color:number;
        innerStrength:number;
        outerStrength:number;
    }
    export interface GlowFilterOptions {
        color?:number;
        distance?:number;
        innerStrength?:number;
        outerStrength?:number;
        quality?:number;
    }
}
