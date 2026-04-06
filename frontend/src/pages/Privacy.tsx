import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <Helmet><title>Privacy Policy - Giftmakr | AI Gift Recommendations</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed text-sm">
          <p><strong>Last updated:</strong> April 2026</p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">What we collect</h2>
          <p>
            We do not collect personal information. Quiz answers are sent to our server to generate
            recommendations and are not stored after the session ends.
          </p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Cookies</h2>
          <p>We do not use tracking cookies. No analytics are collected at this time.</p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Affiliate links</h2>
          <p>
            Product links contain Amazon affiliate tags. When you purchase through these links,
            we receive a small commission at no extra cost to you.
          </p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">support@giftmakr.com</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
