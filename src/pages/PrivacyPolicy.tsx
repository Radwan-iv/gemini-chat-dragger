import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray dark:prose-invert">
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Search queries and interactions with our AI system</li>
            <li>Usage data and analytics</li>
            <li>Device information</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Analyze usage patterns</li>
            <li>Enhance user experience</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We implement appropriate security measures to protect your information.</p>

          <h2>4. Updates to Privacy Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;