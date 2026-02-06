import { U as UseArtifactOptions, a as UseArtifactReturn, b as UseArtifactActions, c as UseArtifactsOptions, d as UseArtifactsReturn, e as UseArtifactsActions } from './index-DBjs88T6.js';
export { A as ArtifactCallbacks, f as ArtifactConfig, g as ArtifactData, h as ArtifactError, i as ArtifactStatus, S as StreamingArtifact, j as artifact, k as getWriter } from './index-DBjs88T6.js';
import { z } from 'zod';
import 'ai';

type InferArtifactType<T> = T extends {
    schema: z.ZodSchema<infer U>;
} ? U : never;
declare function useArtifact<T extends {
    id: string;
    schema: z.ZodSchema<unknown>;
}>(artifactDef: T, options?: UseArtifactOptions<InferArtifactType<T>>): [UseArtifactReturn<InferArtifactType<T>>, UseArtifactActions];
declare function useArtifacts(options?: UseArtifactsOptions): [UseArtifactsReturn, UseArtifactsActions];

export { UseArtifactActions, UseArtifactReturn, UseArtifactsActions, UseArtifactsOptions, UseArtifactsReturn, useArtifact, useArtifacts };
