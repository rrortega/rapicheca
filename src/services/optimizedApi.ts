/**
 * Servicio de configuración de timeout y retry para APIs
 * Optimizado para producción con Appwrite y otras APIs
 */

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBackoff: boolean;
  retryableStatuses: readonly number[];
}

interface TimeoutConfig {
  connect: number;
  read: number;
  write: number;
}

interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: TimeoutConfig;
  retry?: Partial<RetryConfig>;
  cache?: {
    enabled: boolean;
    ttl: number;
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  };
}

/**
 * Configuración de timeout optimizada para diferentes tipos de requests
 */
export const TIMEOUT_CONFIGS = {
  fast: {
    connect: 5000,
    read: 10000,
    write: 10000,
  },
  normal: {
    connect: 10000,
    read: 30000,
    write: 30000,
  },
  slow: {
    connect: 15000,
    read: 60000,
    write: 60000,
  },
  fileUpload: {
    connect: 20000,
    read: 120000,
    write: 120000,
  },
} as const;

/**
 * Configuración de retry optimizada para diferentes tipos de operaciones
 */
export const RETRY_CONFIGS = {
  default: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    exponentialBackoff: true,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
  idempotent: {
    maxRetries: 2,
    baseDelay: 500,
    maxDelay: 5000,
    exponentialBackoff: true,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
  critical: {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 30000,
    exponentialBackoff: true,
    retryableStatuses: [408, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524],
  },
  readOnly: {
    maxRetries: 1,
    baseDelay: 500,
    maxDelay: 2000,
    exponentialBackoff: false,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
} as const;

/**
 * Cache service para optimizar requests frecuentes
 */
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

const apiCache = new APICache();

/**
 * Calcular delay exponencial para retries
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number, exponential: boolean): number {
  if (!exponential) return baseDelay;
  
  const delay = baseDelay * Math.pow(2, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Implementar retry con backoff exponencial
 */
async function executeWithRetry<T>(
  requestFn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Si es el último intento, lanzar el error
      if (attempt === config.maxRetries) {
        throw lastError;
      }

      // Verificar si el error es retryable
      const statusCode = (error as any)?.response?.status || (error as any)?.status;
      if (statusCode && !config.retryableStatuses.includes(statusCode)) {
        throw lastError;
      }

      // Calcular delay y esperar
      const delay = calculateDelay(attempt, config.baseDelay, config.maxDelay, config.exponentialBackoff);
      
      // Añadir jitter para evitar thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const finalDelay = delay + jitter;

      console.log(`[API] Retry ${attempt + 1}/${config.maxRetries} in ${finalDelay}ms for error: ${lastError.message}`);
      await new Promise(resolve => setTimeout(resolve, finalDelay));
    }
  }

  throw lastError!;
}

/**
 * Función fetch con timeout personalizado
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: TimeoutConfig): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout.connect + timeout.read);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout.connect + timeout.read}ms`);
    }
    throw error;
  }
}

/**
 * Cache de estrategias
 */
const CACHE_STRATEGIES = {
  'cache-first': async <T>(key: string, requestFn: () => Promise<T>, ttl: number): Promise<T> => {
    const cached = apiCache.get(key);
    if (cached !== null) {
      return cached;
    }
    
    const result = await requestFn();
    apiCache.set(key, result, ttl);
    return result;
  },

  'network-first': async <T>(key: string, requestFn: () => Promise<T>, ttl: number): Promise<T> => {
    try {
      const result = await requestFn();
      apiCache.set(key, result, ttl);
      return result;
    } catch (error) {
      const cached = apiCache.get(key);
      if (cached !== null) {
        console.warn('[API] Network failed, serving stale data from cache');
        return cached;
      }
      throw error;
    }
  },

  'stale-while-revalidate': async <T>(key: string, requestFn: () => Promise<T>, ttl: number): Promise<T> => {
    const cached = apiCache.get(key);
    
    // Siempre hacer la request en background
    const requestPromise = requestFn().then(result => {
      apiCache.set(key, result, ttl);
      return result;
    });

    // Si tenemos cached, devolverlo inmediatamente
    if (cached !== null) {
      return cached;
    }

    // Si no hay cache, esperar la request
    return requestPromise;
  },
} as const;

/**
 * Cliente HTTP principal con todas las optimizaciones
 */
export class OptimizedHTTPClient {
  private baseURL: string;
  private defaultTimeout: TimeoutConfig;
  private defaultRetry: RetryConfig;

  constructor(baseURL: string, defaultTimeout: TimeoutConfig = TIMEOUT_CONFIGS.normal) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
    this.defaultRetry = RETRY_CONFIGS.default;
  }

  /**
   * Request genérico con todas las optimizaciones
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    const {
      url,
      method,
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retry: retryConfig = this.defaultRetry,
      cache,
    } = config;

    // Combinar retry config con valores por defecto
    const finalRetry: RetryConfig = {
      ...this.defaultRetry,
      ...retryConfig,
    };

    // Aplicar cache si está habilitado
    if (cache?.enabled) {
      const cacheKey = `${method}:${url}:${JSON.stringify(body || headers)}`;
      return CACHE_STRATEGIES[cache.strategy](
        cacheKey,
        () => this.executeRequest<T>(url, method, headers, body, timeout, finalRetry),
        cache.ttl
      );
    }

    return this.executeRequest<T>(url, method, headers, body, timeout, finalRetry);
  }

  private async executeRequest<T>(
    url: string,
    method: RequestConfig['method'],
    headers: Record<string, string>,
    body: any,
    timeout: TimeoutConfig,
    retry: RetryConfig
  ): Promise<T> {
    const requestFn = async (): Promise<T> => {
      const response = await fetchWithTimeout(
        `${this.baseURL}${url}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    };

    return executeWithRetry(requestFn, retry);
  }

  /**
   * Métodos específicos optimizados para casos comunes
   */
  async get<T = any>(url: string, cache?: RequestConfig['cache']): Promise<T> {
    return this.request<T>({ url, method: 'GET', cache });
  }

  async post<T = any>(url: string, body: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      body,
      timeout: TIMEOUT_CONFIGS.normal,
      retry: RETRY_CONFIGS.default,
    });
  }

  async put<T = any>(url: string, body: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      body,
      timeout: TIMEOUT_CONFIGS.normal,
      retry: RETRY_CONFIGS.idempotent,
    });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      timeout: TIMEOUT_CONFIGS.fast,
      retry: RETRY_CONFIGS.idempotent,
    });
  }

  /**
   * Upload de archivos con configuración específica
   */
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      body: file,
      timeout: TIMEOUT_CONFIGS.fileUpload,
      retry: RETRY_CONFIGS.critical,
    });
  }

  /**
   * Operaciones críticas que requieren más retries
   */
  async critical<T = any>(config: RequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      retry: RETRY_CONFIGS.critical,
    });
  }

  /**
   * Operaciones de solo lectura
   */
  async readOnly<T = any>(config: RequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      retry: RETRY_CONFIGS.readOnly,
      cache: config.cache || {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutos
        strategy: 'stale-while-revalidate',
      },
    });
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    apiCache.clear();
  }

  /**
   * Eliminar entrada específica del cache
   */
  invalidateCache(pattern: string): void {
    // Necesitamos exponer el método de getKeys en la clase APICache o usar una aproximación diferente
    const keys = Array.from(apiCache['cache'].keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    });
  }
}

/**
 * Cliente específico para Appwrite con configuraciones optimizadas
 */
export const appwriteClient = new OptimizedHTTPClient('https://aw.chamba.pro/v1', TIMEOUT_CONFIGS.normal);

/**
 * Cliente específico para APIs críticas
 */
export const criticalClient = new OptimizedHTTPClient('', TIMEOUT_CONFIGS.slow);

/**
 * Hook para React Query con configuraciones optimizadas
 */
export const optimizedQueryOptions = {
  // Datos que cambian frecuentemente
  dynamic: {
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount: number, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  
  // Datos estáticos
  static: {
    staleTime: 60 * 60 * 1000, // 1 hora
    cacheTime: 24 * 60 * 60 * 1000, // 24 horas
    retry: false,
  },
  
  // Datos de usuario
  user: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    retryDelay: 1000,
  },
} as const;

export default OptimizedHTTPClient;
