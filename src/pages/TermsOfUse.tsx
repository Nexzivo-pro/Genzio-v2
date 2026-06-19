export default function TermsOfUse() {
  return (
    <div className="flex flex-col gap-12 pb-24 pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12 border-b border-white/10 pb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Terms of Use</h1>
        <p className="text-gray-400">Last updated: October 2023</p>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Genzio service (the "Service"), owned and operated by NEXZIVO ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Use. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Acceptable Use Policy</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Send unsolicited spam emails that violate the CAN-SPAM Act, GDPR, or other applicable anti-spam legislation.</li>
            <li>Promote illegal activities, distribute malicious software, or engage in phishing.</li>
            <li>Send content that is highly offensive, abusive, defamatory, or discriminatory.</li>
            <li>We reserve the right to immediately suspend or terminate accounts that violate our acceptable use policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Deliverability Disclaimer</h2>
          <p>
            While Genzio provides tools and infrastructure (such as warmup networks and syntax spinning) designed to maximize email deliverability, we cannot guarantee 100% inbox placement. Deliverability depends on numerous factors outside our control, including your domain age, historical sender reputation, and the specific content of your messages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Subscriptions and Payments</h2>
          <p>
            The Service is billed on a subscription basis ("Subscriptions"). You will be billed in advance on a recurring and periodic basis (monthly or annually). Your Subscription will automatically renew under the exact same conditions unless you cancel it before the renewal date.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall NEXZIVO, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
      </div>
    </div>
  );
}
