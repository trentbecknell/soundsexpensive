// Web Worker for mix analysis compute (no DOM APIs)
import { computeMixFromFeatures } from '../lib/mixAnalysis';
import type { AudioFeatures, MixAnalysisResult, MixingStage } from '../types/mixAnalysis';

type ComputeMessage = {
  id: string;
  type: 'compute';
  payload: {
    features: AudioFeatures;
    fileInfo: { name: string; size_bytes?: number; format?: string };
    targetGenre?: string;
    mixingStage?: MixingStage;
    customBenchmarks?: Partial<import('../types/mixAnalysis').MixBenchmarks>;
  };
};

type ResponseMessage =
  | { id: string; ok: true; result: MixAnalysisResult }
  | { id: string; ok: false; error: string };

self.onmessage = async (e: MessageEvent<ComputeMessage>) => {
  const { id, type, payload } = e.data;
  try {
    if (type !== 'compute') throw new Error('Unknown message type');
    const result = await computeMixFromFeatures(
      payload.features,
      payload.fileInfo,
      payload.targetGenre,
      payload.mixingStage,
      payload.customBenchmarks
    );
    const msg: ResponseMessage = { id, ok: true, result };
    (self as any).postMessage(msg);
  } catch (err: any) {
    const msg: ResponseMessage = { id, ok: false, error: err?.message || 'Worker compute failed' };
    (self as any).postMessage(msg);
  }
};
