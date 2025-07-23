import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppSidebar } from '@/components/AppSidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PatientData = Tables<'patients'>;

export default function PaymentsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    patientName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { data: patientsData, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients data...');
      const { data, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      console.log('Patients data fetched:', data);
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar dados dos pacientes',
        variant: 'destructive',
      });
    }

    if (patientsData) {
      setPatients(patientsData);
    }
  }, [error, patientsData, toast]);

  const handleNewPayment = () => {
    // Aqui você implementará a lógica para salvar o novo pagamento
    console.log('Novo pagamento:', newPayment);
    toast({
      title: 'Sucesso',
      description: 'Pagamento registrado com sucesso!',
    });
    setIsDialogOpen(false);
    setNewPayment({
      patientName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const mockPayments = [
    {
      id: 1,
      patientName: 'João Silva',
      date: new Date(),
      amount: 150.0,
      status: 'Pago',
    },
    {
      id: 2,
      patientName: 'Maria Santos',
      date: new Date(),
      amount: 150.0,
      status: 'Pendente',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pagamentos</h1>
          <p className="text-gray-600">Gerencie os pagamentos das consultas</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Histórico de Pagamentos</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Novo Pagamento</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Pagamento</DialogTitle>
                    <DialogDescription>
                      Registre um novo pagamento de consulta
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patientName">Nome do Paciente</Label>
                      <Input
                        id="patientName"
                        value={newPayment.patientName}
                        onChange={(e) => setNewPayment({ ...newPayment, patientName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Valor</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleNewPayment}>Salvar Pagamento</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.patientName}</TableCell>
                      <TableCell>
                        {format(payment.date, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        {payment.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            payment.status === 'Pago'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Total Recebido</h3>
              <p className="text-2xl font-bold text-green-600">R$ 3.750,00</p>
              <p className="text-sm text-gray-500">Último mês</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Pagamentos Pendentes</h3>
              <p className="text-2xl font-bold text-yellow-600">R$ 900,00</p>
              <p className="text-sm text-gray-500">5 pagamentos</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Próximos Vencimentos</h3>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-500">Esta semana</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}