import React from 'react';
import PricingPage from '@/lib/components/home/Pricing';

/* The prices depend on today's date, and the list of upfront years rolls over
   on 1 August. Revalidating hourly keeps the rendered page fresh without
   making it fully dynamic, and passing the date down means the server render
   and the client hydration measure from the same moment. */
export const revalidate = 3600;

export default function Pricing() {
  return <PricingPage today={new Date().toISOString()} />;
}
