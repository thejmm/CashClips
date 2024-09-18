interface PromoteKit {
  refer: (email: string, stripe_customer_id?: string) => void;
}

declare global {
  interface Window {
    promotekit_referral?: string;
    promotekit?: PromoteKit;
  }
}

export {};
