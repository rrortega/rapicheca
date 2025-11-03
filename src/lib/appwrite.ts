import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Configuración de Appwrite
const client = new Client();

client
  .setEndpoint('https://aw.chamba.pro/v1')
  .setProject('69083e13001189dca41d');

// Servicios de Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// IDs de la base de datos y colecciones
export const DATABASE_ID = 'estudios-socioeconomicos';

export const COLLECTIONS = {
  WORKSPACES: 'workspaces',
  WORKSPACE_USERS: 'workspace_users',
  TEMPLATES: 'templates',
  CASES: 'cases',
  CREDITS_TRANSACTIONS: 'credits_transactions',
  BILLING_HISTORY: 'billing_history',
  SCORING_RULES: 'scoring_rules',
  AUDIT_LOGS: 'audit_logs',
  INTEGRATIONS: 'integrations',
} as const;

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'estudios-documentos-casos',
  WORKSPACE_ASSETS: 'estudios-documentos-workspace',
  PUBLIC: 'estudios-documentos-public',
} as const;

export default client;
