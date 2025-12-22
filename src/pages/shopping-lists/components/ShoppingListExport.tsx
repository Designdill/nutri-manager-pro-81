import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, MessageCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { ShoppingList, GroupedItems } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ShoppingListExportProps {
  shoppingList: ShoppingList;
}

export function ShoppingListExport({ shoppingList }: ShoppingListExportProps) {
  const [copied, setCopied] = useState(false);

  const items = shoppingList.shopping_list_items || [];
  
  const groupedItems = items.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const generateTextContent = (): string => {
    let content = `📋 ${shoppingList.title}\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (shoppingList.week_start && shoppingList.week_end) {
      content += `📅 Período: ${format(new Date(shoppingList.week_start), "dd/MM", { locale: ptBR })} - ${format(new Date(shoppingList.week_end), "dd/MM/yyyy", { locale: ptBR })}\n`;
    }
    
    if (shoppingList.patients?.full_name) {
      content += `👤 Paciente: ${shoppingList.patients.full_name}\n`;
    }
    
    content += `\n`;

    for (const [category, categoryItems] of Object.entries(groupedItems)) {
      content += `\n${getCategoryEmoji(category)} ${category.toUpperCase()}\n`;
      content += `─────────────────────────\n`;
      
      for (const item of categoryItems) {
        const checkbox = item.is_checked ? '✅' : '⬜';
        const rawNote = item.raw_quantity ? ` (cru: ${item.raw_quantity} ${item.unit})` : '';
        content += `${checkbox} ${item.food_name} - ${item.quantity} ${item.unit}${rawNote}\n`;
      }
    }

    content += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `Total: ${items.length} itens\n`;
    content += `Comprados: ${items.filter(i => i.is_checked).length}/${items.length}\n`;

    return content;
  };

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      'Frutas e Legumes': '🥬',
      'Talho e Peixaria': '🥩',
      'Laticínios': '🥛',
      'Ovos': '🥚',
      'Mercearia': '🛒',
      'Congelados': '🧊',
      'Bebidas': '🥤',
      'Frutos Secos e Sementes': '🥜',
      'Temperos e Especiarias': '🌿',
      'Outros': '📦',
    };
    return emojis[category] || '📦';
  };

  const handleCopyToClipboard = async () => {
    const content = generateTextContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Lista copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Erro ao copiar lista");
    }
  };

  const handleExportTxt = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista-compras-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Lista exportada como TXT!");
  };

  const handleShareWhatsApp = () => {
    const content = generateTextContent();
    const encodedContent = encodeURIComponent(content);
    const whatsappUrl = `https://wa.me/?text=${encodedContent}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Abrindo WhatsApp...");
  };

  const handleExportPDF = () => {
    // Criar uma versão HTML para impressão
    const content = generateTextContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${shoppingList.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
            }
            pre {
              white-space: pre-wrap;
              font-family: inherit;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
          <script>window.print();</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyToClipboard}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copiar para Área de Transferência
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportTxt}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Imprimir / PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareWhatsApp}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Enviar por WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
