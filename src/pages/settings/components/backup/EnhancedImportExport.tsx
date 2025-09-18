import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { Download, Upload, FileText, Package, Settings, History } from "lucide-react";
import { SettingsFormValues } from "../../types/settings-form";
import { UseFormReturn } from "react-hook-form";

interface EnhancedImportExportProps {
  form: UseFormReturn<SettingsFormValues>;
}

const EXPORT_CATEGORIES = [
  { id: "profile", label: "Perfil", icon: FileText, description: "Informações pessoais e contato" },
  { id: "appearance", label: "Aparência", icon: Settings, description: "Tema, cores e preferências visuais" },
  { id: "notifications", label: "Notificações", icon: Package, description: "Configurações de notificações" },
  { id: "integrations", label: "Integrações", icon: Package, description: "APIs e conexões externas" },
  { id: "email", label: "Email", icon: Package, description: "Configurações de email e templates" },
  { id: "backup", label: "Backup", icon: Package, description: "Configurações de backup automático" },
];

const FORMAT_OPTIONS = [
  { value: "json", label: "JSON", description: "Formato padrão, compatível com importação" },
  { value: "csv", label: "CSV", description: "Para análise em planilhas (somente exportação)" },
];

export function EnhancedImportExport({ form }: EnhancedImportExportProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["profile"]);
  const [exportFormat, setExportFormat] = useState("json");
  const [importData, setImportData] = useState<any>(null);
  const [importCategories, setImportCategories] = useState<string[]>([]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCurrentSettings = () => {
    const formValues = form.getValues();
    return {
      profile: {
        full_name: formValues.full_name,
        phone: formValues.phone,
        address_street: formValues.address_street,
        address_number: formValues.address_number,
        address_complement: formValues.address_complement,
        address_neighborhood: formValues.address_neighborhood,
        address_city: formValues.address_city,
        address_state: formValues.address_state,
        address_postal_code: formValues.address_postal_code,
        address_country: formValues.address_country,
      },
      appearance: {
        theme: formValues.theme,
        language: formValues.language,
        auto_dark_mode: formValues.auto_dark_mode,
        dark_mode_start: formValues.dark_mode_start,
        dark_mode_end: formValues.dark_mode_end,
        custom_theme: formValues.custom_theme,
      },
      notifications: {
        email_notifications: formValues.email_notifications,
        push_notifications: formValues.push_notifications,
        notification_preferences: formValues.notification_preferences,
      },
      integrations: {
        open_food_facts_api_key: formValues.open_food_facts_api_key,
        usda_fooddata_api_key: formValues.usda_fooddata_api_key,
        google_calendar_connected: formValues.google_calendar_connected,
        apple_health_connected: formValues.apple_health_connected,
        meal_delivery_connected: formValues.meal_delivery_connected,
        recipe_planning_connected: formValues.recipe_planning_connected,
      },
      email: {
        email_service: formValues.email_service,
        email_signature: formValues.email_signature,
        email_filters: formValues.email_filters,
        resend_api_key: formValues.resend_api_key,
        smtp_host: formValues.smtp_host,
        smtp_port: formValues.smtp_port,
        smtp_user: formValues.smtp_user,
        smtp_password: formValues.smtp_password,
        smtp_secure: formValues.smtp_secure,
        appointment_reminder_emails: formValues.appointment_reminder_emails,
        progress_report_emails: formValues.progress_report_emails,
        newsletter_emails: formValues.newsletter_emails,
        email_frequency: formValues.email_frequency,
        appointment_reminder_template: formValues.appointment_reminder_template,
        progress_report_template: formValues.progress_report_template,
      },
      backup: {
        auto_backup: formValues.auto_backup,
        backup_frequency: formValues.backup_frequency,
        cloud_storage_provider: formValues.cloud_storage_provider,
        cloud_storage_settings: formValues.cloud_storage_settings,
      },
    };
  };

  const handleExport = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Selecione pelo menos uma categoria",
        description: "Você deve selecionar pelo menos uma categoria para exportar",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const allSettings = getCurrentSettings();
      const selectedData: any = {};
      
      selectedCategories.forEach(category => {
        selectedData[category] = allSettings[category as keyof typeof allSettings];
      });

      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      if (exportFormat === "json") {
        const exportData = {
          timestamp: new Date().toISOString(),
          categories: selectedCategories,
          version: "2.0",
          data: selectedData,
        };
        fileContent = JSON.stringify(exportData, null, 2);
        fileName = `nutri-settings-${selectedCategories.join('-')}-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = "application/json";
      } else {
        // CSV format
        const csvRows: string[] = [];
        csvRows.push("Categoria,Campo,Valor");
        
        selectedCategories.forEach(category => {
          const categoryData = selectedData[category];
          Object.entries(categoryData).forEach(([key, value]) => {
            csvRows.push(`${category},${key},"${String(value)}"`);
          });
        });
        
        fileContent = csvRows.join('\n');
        fileName = `nutri-settings-${selectedCategories.join('-')}-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = "text/csv";
      }

      // Create and download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Log export to history
      await supabase.from("export_history").insert({
        user_id: session?.user?.id,
        export_type: selectedCategories.length === EXPORT_CATEGORIES.length ? "full" : "partial",
        categories_exported: selectedCategories,
        file_format: exportFormat,
        file_size: blob.size,
      });

      toast({
        title: "Configurações exportadas",
        description: `${selectedCategories.length} categoria(s) exportada(s) em formato ${exportFormat.toUpperCase()}`,
      });

      setExportDialogOpen(false);
    } catch (error) {
      console.error("Error during export:", error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.version && data.categories && data.data) {
          setImportData(data);
          setImportCategories(data.categories);
          setImportDialogOpen(true);
        } else {
          throw new Error("Formato de arquivo inválido");
        }
      } catch (error) {
        toast({
          title: "Erro ao ler arquivo",
          description: "O arquivo selecionado não é um backup válido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importData || importCategories.length === 0) return;

    setIsImporting(true);
    try {
      const { data } = importData;
      
      importCategories.forEach(category => {
        if (data[category]) {
          Object.entries(data[category]).forEach(([key, value]) => {
            form.setValue(key as keyof SettingsFormValues, value);
          });
        }
      });

      toast({
        title: "Configurações importadas",
        description: `${importCategories.length} categoria(s) importada(s) com sucesso`,
      });

      setImportDialogOpen(false);
      setImportData(null);
      setImportCategories([]);
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Erro ao importar",
        description: "Não foi possível importar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <CardTitle>Importação & Exportação Avançada</CardTitle>
        </div>
        <CardDescription>
          Exporte ou importe configurações específicas com controle granular
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Exportação Seletiva
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Exportar Configurações</DialogTitle>
                <DialogDescription>
                  Selecione as categorias que deseja exportar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Formato do Arquivo</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMAT_OPTIONS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div>
                  <Label>Categorias para Exportar</Label>
                  <div className="space-y-3 mt-2">
                    {EXPORT_CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <Label htmlFor={category.id} className="font-medium">
                                {category.label}
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleExport}
                  disabled={selectedCategories.length === 0 || isExporting}
                >
                  {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex-1">
            <input
              type="file"
              id="import-settings"
              accept=".json"
              onChange={handleImportFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("import-settings")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importação Seletiva
            </Button>
          </div>
        </div>

        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Importar Configurações</DialogTitle>
              <DialogDescription>
                Selecione as categorias que deseja importar do arquivo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {importData && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4" />
                    <span className="font-medium">Arquivo de Backup</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Criado em: {new Date(importData.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Categorias disponíveis: {importData.categories.length}
                  </p>
                </div>
              )}
              
              <div>
                <Label>Categorias Disponíveis</Label>
                <div className="space-y-2 mt-2">
                  {importCategories.map((categoryId) => {
                    const category = EXPORT_CATEGORIES.find(c => c.id === categoryId);
                    if (!category) return null;
                    
                    const Icon = category.icon;
                    return (
                      <div key={categoryId} className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleImport}
                disabled={importCategories.length === 0 || isImporting}
              >
                {isImporting ? "Importando..." : "Importar Tudo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}