import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingDown, TrendingUp, Award } from "lucide-react";

interface GoalsProgressProps {
  currentWeight: number | null;
  targetWeight: number | null;
  initialWeight: number | null;
}

export function GoalsProgress({ currentWeight, targetWeight, initialWeight }: GoalsProgressProps) {
  const calculateProgress = () => {
    if (!currentWeight || !targetWeight || !initialWeight) return 0;
    
    const totalChange = Math.abs(targetWeight - initialWeight);
    const currentChange = Math.abs(currentWeight - initialWeight);
    
    if (totalChange === 0) return 100;
    
    const progress = (currentChange / totalChange) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getWeightDifference = () => {
    if (!currentWeight || !targetWeight) return null;
    return currentWeight - targetWeight;
  };

  const progress = calculateProgress();
  const weightDiff = getWeightDifference();
  const isLosingWeight = targetWeight && initialWeight && targetWeight < initialWeight;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Progresso da Meta
        </CardTitle>
        {progress >= 100 && <Award className="h-5 w-5 text-yellow-500" />}
      </CardHeader>
      <CardContent className="space-y-4">
        {!targetWeight ? (
          <p className="text-muted-foreground text-sm">
            Meta de peso não definida. Consulte seu nutricionista.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Inicial</p>
                <p className="text-lg font-bold">{initialWeight || '-'} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Atual</p>
                <p className="text-lg font-bold text-primary">{currentWeight || '-'} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Meta</p>
                <p className="text-lg font-bold text-emerald-600">{targetWeight} kg</p>
              </div>
            </div>

            {weightDiff !== null && (
              <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
                {weightDiff > 0 ? (
                  <>
                    {isLosingWeight ? (
                      <TrendingDown className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm">
                      Faltam <strong>{Math.abs(weightDiff).toFixed(1)} kg</strong> para atingir sua meta
                    </span>
                  </>
                ) : weightDiff < 0 ? (
                  <>
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">
                      Você ultrapassou sua meta em <strong>{Math.abs(weightDiff).toFixed(1)} kg</strong>!
                    </span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-emerald-600">
                      Parabéns! Você atingiu sua meta! 🎉
                    </span>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
