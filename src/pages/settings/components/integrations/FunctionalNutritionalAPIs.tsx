import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "../../types/settings-form";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Check, AlertCircle } from "lucide-react";

interface FunctionalNutritionalAPIsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function FunctionalNutritionalAPIs({ form }: FunctionalNutritionalAPIsProps) {
  const { toast } = useToast();
  const [testingApi, setTestingApi] = useState<string | null>(null);

  const testOpenFoodFacts = async () => {
    const apiKey = form.getValues("open_food_facts_api_key");
    if (!apiKey) {
      toast({
        title: "Chave API necessária",
        description: "Insira sua chave da API Open Food Facts para testar",
        variant: "destructive",
      });
      return;
    }

    setTestingApi("openfoodfacts");
    try {
      // Teste com um produto conhecido
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/7622210129628.json`, {
        headers: {
          'User-Agent': `NutriManager/1.0 (${apiKey})`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 1) {
          toast({
            title: "✅ API funcionando",
            description: `Teste realizado com sucesso: ${data.product?.product_name || 'Produto encontrado'}`,
          });
        } else {
          throw new Error("Produto não encontrado");
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Open Food Facts test failed:", error);
      toast({
        title: "❌ Erro no teste",
        description: "Verifique sua chave API e conexão com a internet",
        variant: "destructive",
      });
    } finally {
      setTestingApi(null);
    }
  };

  const testUSDAFoodData = async () => {
    const apiKey = form.getValues("usda_fooddata_api_key");
    if (!apiKey) {
      toast({
        title: "Chave API necessária",
        description: "Insira sua chave da API USDA FoodData Central para testar",
        variant: "destructive",
      });
      return;
    }

    setTestingApi("usda");
    try {
      // Teste de busca simples
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=banana&pageSize=1`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.foods && data.foods.length > 0) {
          toast({
            title: "✅ API funcionando",
            description: `Teste realizado com sucesso: ${data.foods[0].description}`,
          });
        } else {
          throw new Error("Nenhum alimento encontrado");
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("USDA FoodData test failed:", error);
      toast({
        title: "❌ Erro no teste",
        description: "Verifique sua chave API e conexão com a internet",
        variant: "destructive",
      });
    } finally {
      setTestingApi(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">APIs de Dados Nutricionais</h3>
        <p className="text-sm text-muted-foreground">
          Configure as APIs para busca automática de informações nutricionais
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Open Food Facts</h4>
              <Badge variant="secondary">Gratuita</Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
            >
              <a 
                href="https://world.openfoodfacts.org/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Obter API Key
              </a>
            </Button>
          </div>

          <FormField
            control={form.control}
            name="open_food_facts_api_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave API</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      value={field.value || ""} 
                      placeholder="Sua chave da API Open Food Facts"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testOpenFoodFacts}
                    disabled={!field.value || testingApi === "openfoodfacts"}
                  >
                    {testingApi === "openfoodfacts" ? "Testando..." : "Testar"}
                  </Button>
                </div>
                <FormDescription>
                  Base de dados colaborativa com mais de 2 milhões de produtos
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">USDA FoodData Central</h4>
              <Badge variant="secondary">Oficial</Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
            >
              <a 
                href="https://fdc.nal.usda.gov/api-guide.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Obter API Key
              </a>
            </Button>
          </div>

          <FormField
            control={form.control}
            name="usda_fooddata_api_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave API</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      value={field.value || ""} 
                      placeholder="Sua chave da API USDA"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testUSDAFoodData}
                    disabled={!field.value || testingApi === "usda"}
                  >
                    {testingApi === "usda" ? "Testando..." : "Testar"}
                  </Button>
                </div>
                <FormDescription>
                  Base de dados oficial do Departamento de Agricultura dos EUA
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Como usar as APIs</p>
            <p>Após configurar as chaves, o sistema buscará automaticamente informações nutricionais ao cadastrar alimentos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}