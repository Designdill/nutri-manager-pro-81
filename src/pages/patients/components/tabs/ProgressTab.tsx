import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Calendar } from "lucide-react";

interface ProgressTabProps {
  patient: any;
  consultations: any[];
}

export function ProgressTab({ patient, consultations }: ProgressTabProps) {
  // Sort consultations by date
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime()
  );

  const firstConsultation = sortedConsultations[0];
  const lastConsultation = sortedConsultations[sortedConsultations.length - 1];

  // Calculate changes
  const calculateChange = (initial: number, current: number) => {
    if (!initial || !current) return null;
    return current - initial;
  };

  const calculatePercentageChange = (initial: number, current: number) => {
    if (!initial || !current) return null;
    return ((current - initial) / initial) * 100;
  };

  const weightChange = firstConsultation && lastConsultation 
    ? calculateChange(firstConsultation.weight, lastConsultation.weight)
    : null;

  const bmiChange = firstConsultation && lastConsultation
    ? calculateChange(firstConsultation.bmi, lastConsultation.bmi)
    : null;

  const bodyFatChange = firstConsultation?.body_fat_percentage && lastConsultation?.body_fat_percentage
    ? calculateChange(firstConsultation.body_fat_percentage, lastConsultation.body_fat_percentage)
    : null;

  const waistChange = firstConsultation?.waist_circumference && lastConsultation?.waist_circumference
    ? calculateChange(firstConsultation.waist_circumference, lastConsultation.waist_circumference)
    : null;

  // Render trend icon
  const renderTrendIcon = (change: number | null) => {
    if (change === null) return <Minus className="h-4 w-4" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4" />;
  };

  const renderTrendBadge = (change: number | null) => {
    if (change === null) return null;
    const variant = change > 0 ? "destructive" : change < 0 ? "default" : "secondary";
    return (
      <Badge variant={variant} className="ml-2">
        {change > 0 ? "+" : ""}{change.toFixed(1)}
      </Badge>
    );
  };

  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma consulta registrada ainda.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Registre a primeira consulta para começar a acompanhar o progresso do paciente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peso Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {lastConsultation?.weight?.toFixed(1) || "-"} kg
                </p>
                {renderTrendBadge(weightChange)}
              </div>
              {renderTrendIcon(weightChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">IMC Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {lastConsultation?.bmi?.toFixed(1) || "-"}
                </p>
                {renderTrendBadge(bmiChange)}
              </div>
              {renderTrendIcon(bmiChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gordura Corporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {lastConsultation?.body_fat_percentage?.toFixed(1) || "-"}%
                </p>
                {renderTrendBadge(bodyFatChange)}
              </div>
              {renderTrendIcon(bodyFatChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meta de Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {patient?.target_weight?.toFixed(1) || "-"} kg
                </p>
                {patient?.target_weight && lastConsultation?.weight && (
                  <Badge variant="outline" className="mt-1">
                    {(lastConsultation.weight - patient.target_weight).toFixed(1)} kg restantes
                  </Badge>
                )}
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedConsultations}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="consultation_date"
                  tickFormatter={(value) => format(new Date(value), "dd/MMM", { locale: ptBR })}
                  className="text-xs"
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  className="text-xs"
                />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                  formatter={(value: any) => [`${value.toFixed(1)} kg`, "Peso"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorWeight)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {patient?.target_weight && (
                  <Line
                    type="monotone"
                    dataKey={() => patient.target_weight}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Meta"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* BMI Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Evolução do IMC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedConsultations}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="consultation_date"
                  tickFormatter={(value) => format(new Date(value), "dd/MMM", { locale: ptBR })}
                  className="text-xs"
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  className="text-xs"
                />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                  formatter={(value: any) => [value.toFixed(1), "IMC"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Body Fat and Measurements */}
      {(sortedConsultations.some(c => c.body_fat_percentage) || 
        sortedConsultations.some(c => c.waist_circumference)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedConsultations.some(c => c.body_fat_percentage) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Gordura Corporal (%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedConsultations.filter(c => c.body_fat_percentage)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="consultation_date"
                        tickFormatter={(value) => format(new Date(value), "dd/MMM", { locale: ptBR })}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                        formatter={(value: any) => [`${value.toFixed(1)}%`, "Gordura"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="body_fat_percentage"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {sortedConsultations.some(c => c.waist_circumference) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Circunferência da Cintura (cm)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedConsultations.filter(c => c.waist_circumference)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="consultation_date"
                        tickFormatter={(value) => format(new Date(value), "dd/MMM", { locale: ptBR })}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                        formatter={(value: any) => [`${value.toFixed(1)} cm`, "Cintura"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="waist_circumference"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedConsultations.slice().reverse().map((consultation, index) => (
              <div key={consultation.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                  {format(new Date(consultation.consultation_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Peso</p>
                    <p className="font-medium">{consultation.weight.toFixed(1)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IMC</p>
                    <p className="font-medium">{consultation.bmi.toFixed(1)}</p>
                  </div>
                  {consultation.body_fat_percentage && (
                    <div>
                      <p className="text-xs text-muted-foreground">Gordura</p>
                      <p className="font-medium">{consultation.body_fat_percentage.toFixed(1)}%</p>
                    </div>
                  )}
                  {consultation.waist_circumference && (
                    <div>
                      <p className="text-xs text-muted-foreground">Cintura</p>
                      <p className="font-medium">{consultation.waist_circumference.toFixed(1)} cm</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}