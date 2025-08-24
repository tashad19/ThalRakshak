import { useMutation } from '@tanstack/react-query';
import { intentClassifier } from '../lib/intent-classifier';

export function useIntentClassification() {
  const classifyMutation = useMutation({
    mutationFn: ({ text, sessionId }: { text: string; sessionId: string }) =>
      intentClassifier.classifyIntent(text, sessionId),
  });

  const imageAnalysisMutation = useMutation({
    mutationFn: ({ file, sessionId }: { file: File; sessionId: string }) =>
      intentClassifier.analyzeImage(file, sessionId),
  });

  return {
    classifyIntent: classifyMutation.mutate,
    analyzeImage: imageAnalysisMutation.mutate,
    isClassifying: classifyMutation.isPending,
    isAnalyzingImage: imageAnalysisMutation.isPending,
    classificationError: classifyMutation.error,
    imageAnalysisError: imageAnalysisMutation.error,
    classificationResult: classifyMutation.data,
    imageAnalysisResult: imageAnalysisMutation.data,
  };
}
