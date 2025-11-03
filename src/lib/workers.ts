import type { AudioFeatures, MixAnalysisResult, MixingStage } from '../types/mixAnalysis';

export async function runMixWorker(
  input: {
    features: AudioFeatures;
    fileInfo: { name: string; size_bytes?: number; format?: string };
    targetGenre?: string;
    mixingStage?: MixingStage;
    customBenchmarks?: Partial<import('../types/mixAnalysis').MixBenchmarks>;
  },
  timeoutMs: number = 15000
): Promise<MixAnalysisResult> {
  const worker = new Worker(new URL('../workers/mixWorker.ts', import.meta.url), { type: 'module' });
  const id = Math.random().toString(36).slice(2);

  return new Promise((resolve, reject) => {
    const cleanup = () => worker.terminate();
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Mix worker timed out'));
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent) => {
      const data = e.data as { id: string; ok: boolean; result?: MixAnalysisResult; error?: string };
      if (data.id !== id) return;
      clearTimeout(timer);
      cleanup();
      if (data.ok) resolve(data.result!);
      else reject(new Error(data.error || 'Mix worker failed'));
    };

    worker.onerror = () => {
      clearTimeout(timer);
      cleanup();
      reject(new Error('Mix worker error'));
    };

    worker.postMessage({ id, type: 'compute', payload: input });
  });
}
