import { functions } from '@/lib/appwrite';
import { ExecutionMethod } from 'appwrite';

export interface CreditPackage {
  credits: number;
  price: number;
  discount?: number;
  label: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    credits: 100,
    price: 150,
    label: 'Basico',
  },
  {
    credits: 500,
    price: 650,
    discount: 13,
    label: 'Popular',
  },
  {
    credits: 1000,
    price: 1200,
    discount: 20,
    label: 'Profesional',
  },
  {
    credits: 5000,
    price: 5000,
    discount: 33,
    label: 'Empresarial',
  },
];

export const stripeService = {
  // Crear sesión de checkout
  async createCheckoutSession(
    workspaceId: string,
    userId: string,
    creditsAmount: number,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      const result = await functions.createExecution(
        'stripe-checkout',
        JSON.stringify({
          workspace_id: workspaceId,
          user_id: userId,
          credits_amount: creditsAmount,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
        false,
        '/',
        ExecutionMethod.POST
      );

      const response = JSON.parse(result.responseBody);
      return response;
    } catch (error) {
      console.error('Error creando sesión de checkout:', error);
      throw error;
    }
  },

  // Redirigir a Stripe Checkout
  async redirectToCheckout(
    workspaceId: string,
    userId: string,
    creditsAmount: number
  ) {
    try {
      const origin = window.location.origin;
      const response = await this.createCheckoutSession(
        workspaceId,
        userId,
        creditsAmount,
        `${origin}/billing?success=true`,
        `${origin}/billing?canceled=true`
      );

      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error redirigiendo a checkout:', error);
      throw error;
    }
  },
};

export default stripeService;
