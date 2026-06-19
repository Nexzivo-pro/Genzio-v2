export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-12 pb-24 pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12 border-b border-white/10 pb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400">Last updated: October 2023</p>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>
            When you use Genzio, a NEXZIVO company product, we collect the following types of information:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Account Information: Name, email address, company name, and billing details.</li>
            <li>Connected Accounts: Authentication tokens for connected email providers (Google Workspace, Microsoft 365, etc.) to facilitate sending emails on your behalf.</li>
            <li>Usage Data: Information about how you interact with our platform, including features used, time spent, and performance metrics of your campaigns.</li>
            <li>Contact Data: Information about the prospects you upload or connect to our system for the purpose of outreach.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>To provide, maintain, and improve the Genzio platform.</li>
            <li>To process payments and manage your account lifecycle.</li>
            <li>To train our AI personalization engine (using aggregated, anonymized data only).</li>
            <li>To send you technical notices, updates, security alerts, and support messages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Data Security and Storage</h2>
          <p>
            We implement enterprise-grade security measures inherited from NEXZIVO infrastructure. All data in transit is encrypted using TLS 1.3, and data at rest is encrypted using AES-256. We do not sell your personal data or your prospects' data to third parties under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
          <p>
            Depending on your location, you may have rights under GDPR, CCPA, or other privacy frameworks. These include the right to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, please contact privacy@nexzivo.com.
          </p>
        </section>
      </div>
    </div>
  );
}
