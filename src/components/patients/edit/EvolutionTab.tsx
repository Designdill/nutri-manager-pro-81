import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity, Scale, Ruler } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function EvolutionTab() {
  const { patientId } = useParams();

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["patient-evolution", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("patient_id", patientId)
        .order("consultation_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient-target", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("target_weight, current_weight, height")
        .eq("id", patientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = consultations?.map((c) => ({
    date: format(new Date(c.consultation_date), "dd/MM/yy", { locale: ptBR }),
    fullDate: format(new Date(c.consultation_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    peso: c.weight,
    imc: c.bmi,
    gordura: c.body_fat_percentage,
    cintura: c.waist_circumference,
  })) || [];

  const getVariation = (field: 'peso' | 'imc' | 'gordura' | 'cintura') => {
    if (chartData.length < 2) return null;
    const first = chartData[0][field];
    const last = chartData[chartData.length - 1][field];
    if (first === null || last === null) return null;
    return {
      value: (last - first).toFixed(1),
      percentage: (((last - first) / first) * 100).toFixed(1),
      trend: last < first ? 'down' : last > first ? 'up' : 'stable'
    };
  };

  const weightVariation = getVariation('peso');
  const bmiVariation = getVariation('imc');

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-green-500" />;
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultas</p>
                <p className="text-2xl font-bold">{consultations?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peso Atual</p>
                <p className="text-2xl font-bold">
                  {chartData.length > 0 ? `${chartData[chartData.length - 1].peso} kg` : '-'}
                </p>
                {weightVariation && (
                  <div className="flex items-center gap-1 text-xs">
                    <TrendIcon trend={weightVariation.trend} />
                    <span className={weightVariation.trend === 'down' ? 'text-green-500' : 'text-red-500'}>
                      {weightVariation.value} kg ({weightVariation.percentage}%)
                    </span>
                  </div>
                )}
              </div>
              <Scale className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IMC Atual</p>
                <p className="text-2xl font-bold">
                  {chartData.length > 0 ? chartData[chartData.length - 1].imc?.toFixed(1) : '-'}
                </p>
                {bmiVariation && (
                  <div className="flex items-center gap-1 text-xs">
                    <TrendIcon trend={bmiVariation.trend} />
                    <span className={bmiVariation.trend === 'down' ? 'text-green-500' : 'text-red-500'}>
                      {bmiVariation.value}
                    </span>
                  </div>
                )}
              </div>
              <Ruler className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Meta de Peso</p>
                <p className="text-2xl font-bold">
                  {patient?.target_weight ? `${patient.target_weight} kg` : '-'}
                </p>
                {patient?.target_weight && chartData.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Faltam {(chartData[chartData.length - 1].peso - patient.target_weight).toFixed(1)} kg
                  </p>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma consulta registrada ainda</p>
              <p className="text-sm">Os gráficos aparecerão após registrar consultas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(_, payload) => payload[0]?.payload?.fullDate}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorPeso)"
                  name="Peso (kg)" 
                  strokeWidth={2}
                />
                {patient?.target_weight && (
                  <Line 
                    type="monotone" 
                    dataKey={() => patient.target_weight}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    name="Meta"
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* BMI and Body Composition Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Evolução do IMC
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Sem dados disponíveis
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="imc" 
                    stroke="hsl(var(--chart-2))" 
                    name="IMC" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Composição Corporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 || !chartData.some(d => d.gordura || d.cintura) ? (
              <div className="text-center py-8 text-muted-foreground">
                Sem dados de composição corporal
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {chartData.some(d => d.gordura) && (
                    <Line 
                      type="monotone" 
                      dataKey="gordura" 
                      stroke="hsl(var(--chart-3))" 
                      name="Gordura (%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-3))' }}
                    />
                  )}
                  {chartData.some(d => d.cintura) && (
                    <Line 
                      type="monotone" 
                      dataKey="cintura" 
                      stroke="hsl(var(--chart-4))" 
                      name="Cintura (cm)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-4))' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
