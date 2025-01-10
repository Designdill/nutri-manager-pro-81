import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../types";
import { ProfilePhotoUpload } from "./profile/ProfilePhotoUpload";
import { AddressFields } from "./profile/AddressFields";

interface ProfileSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function ProfileSettings({ form }: ProfileSettingsProps) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
  const validateEmail = (value: string) => {
    if (!value) return "Email é obrigatório";
    if (!emailRegex.test(value)) return "Por favor, insira um email válido";
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Perfil</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerencie suas informações pessoais</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Gerencie suas informações pessoais e endereço
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePhotoUpload />
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    className={fieldState.error ? "border-red-500" : fieldState.isDirty ? "border-green-500" : ""}
                    {...field} 
                    onBlur={(e) => {
                      field.onBlur();
                      const validationResult = validateEmail(e.target.value);
                      if (validationResult !== true) {
                        form.setError("email", { message: validationResult });
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Endereço</h3>
          <AddressFields form={form} />
        </div>
      </CardContent>
    </Card>
  );
}