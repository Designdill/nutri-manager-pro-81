import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";

interface DateRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) {
  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
            onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Data Final</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
            onChange={(e) => onEndDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setQuickRange(30)}>
          Últimos 30 dias
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setQuickRange(60)}>
          Últimos 60 dias
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setQuickRange(90)}>
          Últimos 90 dias
        </Button>
      </div>
    </div>
  );
}
