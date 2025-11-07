// @ts-nocheck
import { account } from '@/lib/appwrite';

/**
 * Script de diagnóstico para problemas de autenticación con Appwrite
 * Ayuda a identificar problemas de permisos y scopes
 */
export class AuthDiagnostics {
  
  /**
   * Ejecuta un diagnóstico completo de autenticación
   */
  static async runFullDiagnostics(): Promise<{
    session: any;
    user: any;
    permissions: any;
    issues: string[];
    recommendations: string[];
  }> {
    console.log('🔍 Iniciando diagnóstico de autenticación...');
    
    const results = {
      session: null,
      user: null,
      permissions: null,
      issues: [],
      recommendations: []
    };

    try {
      // 1. Verificar sesión actual
      console.log('1. Verificando sesión actual...');
      try {
        const session = await account.getSession('current');
        results.session = {
          exists: true,
          id: session.$id,
          userId: session.userId,
          expire: session.expire,
          provider: session.provider,
          providerUid: session.providerUid
        };
        console.log('✅ Sesión encontrada:', session.$id);
      } catch (error) {
        results.session = { exists: false, error: error.message };
        results.issues.push('No hay sesión activa');
        results.recommendations.push('Hacer login para crear una nueva sesión');
        console.log('❌ No hay sesión activa:', error.message);
      }

      // 2. Verificar usuario actual
      console.log('2. Verificando usuario actual...');
      try {
        const user = await account.get();
        results.user = {
          exists: true,
          id: user.$id,
          email: user.email,
          name: user.name,
          registration: user.registration,
          roles: user.roles
        };
        console.log('✅ Usuario encontrado:', user.email);
      } catch (error) {
        results.user = { exists: false, error: error.message };
        results.issues.push('Error al obtener usuario: ' + error.message);
        
        if (error?.code === 401) {
          results.issues.push('Error 401: Problema de permisos o scope');
          results.recommendations.push('Verificar configuración de scopes en Appwrite');
          results.recommendations.push('Asegurar que el usuario tenga rol con permisos "account"');
        }
        console.log('❌ Error obteniendo usuario:', error.message);
      }

      // 3. Verificar scopes y roles
      console.log('3. Verificando scopes y roles...');
      if (results.user?.exists) {
        try {
          // Intentar diferentes operaciones para verificar permisos
          const operations = [
            { name: 'getAccount', operation: () => account.get() },
            { name: 'getSession', operation: () => account.getSession('current') }
          ];

          results.permissions = {};
          for (const op of operations) {
            try {
              await op.operation();
              results.permissions[op.name] = { allowed: true };
              console.log(`✅ ${op.name}: Permitido`);
            } catch (error) {
              results.permissions[op.name] = { 
                allowed: false, 
                error: error.message,
                code: error.code 
              };
              console.log(`❌ ${op.name}: ${error.message}`);
            }
          }
        } catch (error) {
          results.permissions = { error: error.message };
        }
      }

    } catch (error) {
      results.issues.push('Error en diagnóstico: ' + error.message);
    }

    // Generar recomendaciones finales
    this.generateRecommendations(results);
    
    return results;
  }

  /**
   * Genera recomendaciones específicas basadas en los resultados
   */
  private static generateRecommendations(results: any): void {
    const { issues, user } = results;

    if (issues.includes('Error 401: Problema de permisos o scope')) {
      results.recommendations.push('1. Verificar configuración de Appwrite:');
      results.recommendations.push('   - Ir a Authentication > Settings en Appwrite');
      results.recommendations.push('   - Habilitar el scope "account" para usuarios autenticados');
      results.recommendations.push('   - Verificar que el rol del usuario incluya los permisos necesarios');
      
      results.recommendations.push('2. Opciones de configuración en Appwrite:');
      results.recommendations.push('   - Scopes necesarios: account, users, databases');
      results.recommendations.push('   - Para usuarios "guest", agregar permisos explícitos');
      
      results.recommendations.push('3. Solución temporal en código:');
      results.recommendations.push('   - Verificar que getSession() funcione antes de get()');
      results.recommendations.push('   - Manejar errores 401 de forma graciosa');
    }

    if (user?.exists && !user.roles?.includes('users')) {
      results.recommendations.push('El usuario no tiene rol de "users". Verificar asignación de roles en Appwrite.');
    }
  }

  /**
   * Log de diagnóstico en consola
   */
  static logResults(results: any): void {
    console.log('\n📊 REPORTE DE DIAGNÓSTICO DE AUTENTICACIÓN');
    console.log('='.repeat(50));
    
    console.log('\n🔑 SESIÓN:');
    console.log(JSON.stringify(results.session, null, 2));
    
    console.log('\n👤 USUARIO:');
    console.log(JSON.stringify(results.user, null, 2));
    
    console.log('\n🔐 PERMISOS:');
    console.log(JSON.stringify(results.permissions, null, 2));
    
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:');
    results.issues.forEach(issue => console.log('  • ' + issue));
    
    console.log('\n💡 RECOMENDACIONES:');
    results.recommendations.forEach(rec => console.log('  • ' + rec));
    
    console.log('\n' + '='.repeat(50));
  }
}

/**
 * Hook para usar en desarrollo
 */
export const useAuthDiagnostics = () => {
  return {
    runDiagnostics: AuthDiagnostics.runFullDiagnostics,
    logResults: AuthDiagnostics.logResults
  };
};

export default AuthDiagnostics;