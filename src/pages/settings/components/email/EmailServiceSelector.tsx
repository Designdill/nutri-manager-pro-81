import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";

interface EmailServiceSelectorProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function EmailServiceSelector({ form }: EmailServiceSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="email_service"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Serviço de Email</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="resend" id="resend" />
                <label htmlFor="resend" className="flex flex-col">
                  <span className="font-medium">Resend</span>
                  <span className="text-sm text-muted-foreground">
                    Use o serviço Resend para envio de emails
                  </span>
                </label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="smtp" id="smtp" />
                <label htmlFor="smtp" className="flex flex-col">
                  <span className="font-medium">SMTP Próprio</span>
                  <span className="text-sm text-muted-foreground">
                    Use seu próprio servidor SMTP
                  </span>
                </label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}