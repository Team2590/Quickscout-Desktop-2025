import { z } from 'zod'

export const DataSchema = z.object({
    matchNum: z.coerce.number().default(0),
    teamNum: z.coerce.number().default(0),
    scoutName: z.coerce.string().default("blank"),
    startingPos: z.enum(['A', 'B', 'C']).nullable(),
    autoCoralL1: z.coerce.number(),
    autoCoralL2: z.coerce.number(),
    autoCoralL3: z.coerce.number(),
    autoCoralL4: z.coerce.number(),
    autoAlgaeRemovedFromReef: z.coerce.number(),
    autoProcessorAlgae: z.coerce.number(),
    autoNetAlgae: z.coerce.number(),
    teleopCoralL1: z.coerce.number(),
    teleopCoralL2: z.coerce.number(),
    teleopCoralL3: z.coerce.number(),
    teleopCoralL4: z.coerce.number(),
    teleopAlgaeRemovedFromReef: z.coerce.number(),
    teleopProcessorAlgae: z.coerce.number(),
    teleopNetAlgae: z.coerce.number(),
    timeTakenToClimb: z.coerce.number(),
    lostComms: z.coerce.boolean(),
})