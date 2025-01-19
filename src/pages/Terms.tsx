import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-gray dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily access the materials (information or software) on our website for personal, non-commercial transitory viewing only.</p>

          <h2>3. Disclaimer</h2>
          <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2>4. Limitations</h2>
          <p>In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>

          <h2>5. Revisions</h2>
          <p>We may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;