import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <Helmet><title>About Giftmakr - AI-Powered Gift Recommendation Platform</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">About Giftmakr</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed">
          <p>
            Finding the right gift can be stressful. You want something meaningful, within budget,
            and that actually matches the person's interests. Giftmakr helps you do exactly that.
          </p>
          <p>
            Answer a few questions about who the gift is for, and we'll search across Amazon to find
            products that fit. No account needed, no cost to you.
          </p>
          <p>
            We earn a small affiliate commission when you purchase through our links — this keeps
            the service free and doesn't affect your price.
          </p>
          <p>
            Questions? Reach us at{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">
              support@giftmakr.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
