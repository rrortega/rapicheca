import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { creditsService } from '@/services/creditsService';
import { stripeService, CREDIT_PACKAGES } from '@/services/stripeService';
import {
  CreditCard,
  Check,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function BillingPage() {
  const { currentWorkspace, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (currentWorkspace) {
      loadBillingData();
    }
  }, [currentWorkspace]);

  const loadBillingData = async () => {
    if (!currentWorkspace) return;

    try {
      setLoading(true);
      const [balance, trans] = await Promise.all([
        creditsService.getBalance(currentWorkspace.$id),
        creditsService.listTransactions(currentWorkspace.$id, 20),
      ]);

      setCredits(balance);
      setTransactions(trans);
    } catch (error) {
      console.error('Error cargando datos de facturación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (creditsAmount: number) => {
    if (!currentWorkspace || !user) return;

    try {
      setProcessingCheckout(true);
      await stripeService.redirectToCheckout(
        currentWorkspace.$id,
        user.$id,
        creditsAmount
      );
    } catch (error) {
      console.error('Error procesando compra:', error);
      alert('Error al procesar la compra. Por favor intente nuevamente.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando facturación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facturación y Créditos</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tu saldo y recarga créditos
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-3 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-medium">Créditos Disponibles</p>
              <p className="text-3xl font-bold text-blue-900">{credits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Cancel Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800">Pago procesado exitosamente. Tus créditos han sido acreditados.</p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <XCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <p className="text-yellow-800">Pago cancelado. Puedes intentar nuevamente cuando lo desees.</p>
          </div>
        </div>
      )}

      {/* Credit Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paquetes de Créditos</h2>
          <p className="text-gray-600">Selecciona el paquete que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.credits}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition ${
                pkg.discount ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {pkg.discount && (
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  {pkg.discount}% DESCUENTO
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.label}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{pkg.credits}</span>
                <span className="text-gray-500 ml-2">créditos</span>
              </div>
              <div className="mb-6">
                <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
                <span className="text-gray-500 ml-1">MXN</span>
                {pkg.discount && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${(pkg.credits * 1.5).toFixed(0)} sin descuento
                  </p>
                )}
              </div>
              <button
                onClick={() => handlePurchase(pkg.credits)}
                disabled={processingCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingCheckout ? 'Procesando...' : 'Comprar Ahora'}
              </button>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay transacciones registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.transaction_type === 'topup'
                            ? 'bg-green-100 text-green-800'
                            : transaction.transaction_type === 'consumption'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.transaction_type === 'topup' ? 'Recarga' :
                           transaction.transaction_type === 'consumption' ? 'Consumo' :
                           transaction.transaction_type === 'refund' ? 'Reembolso' : 'Ajuste'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {transaction.balance_after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pricing Info */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Costo por Operación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">OCR de Documento</p>
                <p className="text-xs text-blue-700">1 crédito</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Análisis de IA</p>
                <p className="text-xs text-blue-700">2 créditos</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Background Check</p>
                <p className="text-xs text-blue-700">3 créditos</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Llamada Automatizada</p>
                <p className="text-xs text-blue-700">2 créditos</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Firma Electrónica</p>
                <p className="text-xs text-blue-700">1 crédito</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
