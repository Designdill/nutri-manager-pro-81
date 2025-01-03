import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types";

interface ResendSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function ResendSettings({ form }: ResendSettingsProps) {
  return (
    <FormField
      control={form.control}
      name="resend_api_key"
      render={({ field }) => (
        <FormItem>
          <FormLabel>API Key do Resend</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormDescription>
            Insira sua chave de API do Resend
          </FormDescription>
        </FormItem>
      )}
    />
  );
}