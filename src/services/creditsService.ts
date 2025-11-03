import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface CreditTransaction {
  $id: string;
  workspace_id: string;
  user_id: string;
  case_id?: string;
  transaction_type: 'consumption' | 'topup' | 'refund' | 'adjustment';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  metadata: {
    operation?: string;
    document_count?: number;
    processing_time?: number;
    api_call_id?: string;
  };
  created_at: string;
}

export const creditsService = {
  // Obtener balance actual
  async getBalance(workspaceId: string): Promise<number> {
    try {
      const workspace = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES,
        workspaceId
      );
      return workspace.credits_balance || 0;
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      return 0;
    }
  },

  // Listar transacciones
  async listTransactions(workspaceId: string, limit = 50) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CREDITS_TRANSACTIONS,
        [
          Query.equal('workspace_id', workspaceId),
          Query.orderDesc('created_at'),
          Query.limit(limit)
        ]
      );

      return result.documents.map((doc: any) => ({
        ...doc,
        metadata: JSON.parse(doc.metadata || '{}'),
      })) as CreditTransaction[];
    } catch (error) {
      console.error('Error listando transacciones:', error);
      return [];
    }
  },

  // Consumir créditos
  async consumeCredits(
    workspaceId: string,
    userId: string,
    amount: number,
    description: string,
    metadata?: Record<string, any>,
    caseId?: string
  ) {
    try {
      // Obtener balance actual
      const currentBalance = await this.getBalance(workspaceId);

      if (currentBalance < amount) {
        throw new Error('Créditos insuficientes');
      }

      const newBalance = currentBalance - amount;

      // Crear transacción
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CREDITS_TRANSACTIONS,
        ID.unique(),
        {
          workspace_id: workspaceId,
          user_id: userId,
          case_id: caseId || null,
          transaction_type: 'consumption',
          amount: -amount,
          balance_before: currentBalance,
          balance_after: newBalance,
          description,
          metadata: JSON.stringify(metadata || {}),
          created_at: new Date().toISOString(),
        }
      );

      // Actualizar balance en workspace
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES,
        workspaceId,
        {
          credits_balance: newBalance,
        }
      );

      return { success: true, new_balance: newBalance };
    } catch (error) {
      console.error('Error consumiendo créditos:', error);
      throw error;
    }
  },

  // Recargar créditos (topup)
  async topupCredits(
    workspaceId: string,
    userId: string,
    amount: number,
    description: string,
    paymentId?: string
  ) {
    try {
      const currentBalance = await this.getBalance(workspaceId);
      const newBalance = currentBalance + amount;

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CREDITS_TRANSACTIONS,
        ID.unique(),
        {
          workspace_id: workspaceId,
          user_id: userId,
          transaction_type: 'topup',
          amount,
          balance_before: currentBalance,
          balance_after: newBalance,
          description,
          metadata: JSON.stringify({ payment_id: paymentId }),
          created_at: new Date().toISOString(),
        }
      );

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES,
        workspaceId,
        {
          credits_balance: newBalance,
        }
      );

      return { success: true, new_balance: newBalance };
    } catch (error) {
      console.error('Error recargando créditos:', error);
      throw error;
    }
  },

  // Estadísticas de consumo
  async getConsumptionStats(workspaceId: string, days = 30) {
    try {
      const transactions = await this.listTransactions(workspaceId, 1000);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentTransactions = transactions.filter(t => 
        new Date(t.created_at) >= cutoffDate
      );

      const consumption = recentTransactions
        .filter(t => t.transaction_type === 'consumption')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const topups = recentTransactions
        .filter(t => t.transaction_type === 'topup')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        total_consumption: consumption,
        total_topups: topups,
        net_change: topups - consumption,
        transaction_count: recentTransactions.length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de consumo:', error);
      return null;
    }
  },
};

export default creditsService;
