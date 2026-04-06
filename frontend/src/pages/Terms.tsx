import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <Helmet><title>Terms of Service - Giftmakr | AI Gift Recommendations</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">Terms of Service</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed text-sm">
          <p><strong>Last updated:</strong> April 2026</p>
          <p>
            By using Giftmakr, you agree to these terms. Giftmakr provides gift recommendations
            as suggestions only. We are not responsible for the quality, availability, or pricing
            of products on Amazon.
          </p>
          <p>
            Product prices and availability are determined by Amazon at the time of purchase
            and may differ from what is shown on our site.
          </p>
          <p>
            We reserve the right to modify or discontinue the service at any time without notice.
          </p>
          <p>
            Contact:{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">support@giftmakr.com</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
