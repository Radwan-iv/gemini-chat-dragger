import React, { useState, FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateFacebookLink,
  validateSegment
} from "@/lib/validations";

// Available segments
const SEGMENTS = [
  "AI Solutions",
  "Operations",
  "Design",
  "Video Editing",
  "Motion Graphics",
  "HR",
  "Marketing",
  "PR",
  "Magazine"
];

// Submission endpoints
const ENDPOINTS = {
  PRIMARY: "https://formspree.io/f/xanynnyn",
  SECONDARY: "https://formspree.io/f/xpwqvjov"
};

// Submission counter in localStorage
const STORAGE_KEY = "nctu_form_submissions";

const Index = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    segment: "",
    email: "",
    phone: "",
    facebookLink: "",
    hasExperience: false,
    experienceDetails: ""
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    segment: "",
    email: "",
    phone: "",
    facebookLink: "",
    experienceDetails: ""
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Submission counter
  const [submissionCount, setSubmissionCount] = useState(0);
  
  // Load submission count on component mount
  useEffect(() => {
    const storedCount = localStorage.getItem(STORAGE_KEY);
    if (storedCount) {
      setSubmissionCount(parseInt(storedCount, 10));
    }
  }, []);
  
  // Update localStorage when submission count changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, submissionCount.toString());
  }, [submissionCount]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement & HTMLTextAreaElement;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Select a segment
  const selectSegment = (segment: string) => {
    setFormData(prev => ({ ...prev, segment }));
    setShowDropdown(false);
    
    // Clear error when user selects a segment
    if (errors.segment) {
      setErrors(prev => ({ ...prev, segment: "" }));
    }
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateName(formData.name) || "",
      segment: validateSegment(formData.segment) || "",
      email: validateEmail(formData.email) || "",
      phone: validatePhone(formData.phone) || "",
      facebookLink: validateFacebookLink(formData.facebookLink) || "",
      experienceDetails: formData.hasExperience && !formData.experienceDetails.trim() ? "Please provide details about your experience" : ""
    };
    
    setErrors(newErrors);
    
    // Form is valid if there are no error messages
    return !Object.values(newErrors).some(error => error);
  };
  
  // Get the current submission endpoint based on count
  const getCurrentEndpoint = () => {
    // Use secondary endpoint for submissions 50-99, then go back to primary
    if (submissionCount >= 49 && submissionCount < 99) {
      return ENDPOINTS.SECONDARY;
    }
    return ENDPOINTS.PRIMARY;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const endpoint = getCurrentEndpoint();
      console.log(`Submitting to endpoint: ${endpoint} (submission #${submissionCount + 1})`);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success("Thank you for joining us!");
        
        // Increment submission counter
        setSubmissionCount(prev => prev + 1);
        
        // Reset form after successful submission
        setFormData({
          name: "",
          segment: "",
          email: "",
          phone: "",
          facebookLink: "",
          hasExperience: false,
          experienceDetails: ""
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto animate-fade-in">
        {/* Header with Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/8a686d7b-a5a8-4b04-b5ee-a7881124c2cb.png" 
              alt="NCTU Petroleum Tech Logo" 
              className="h-16 md:h-20"
            />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight sm:text-5xl md:text-6xl font-ibm-plex">
              Join Our Team
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl md:ml-auto font-ibm-plex">
              Become part of our growing community and help us shape the future
            </p>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form Section */}
            <div className="p-8 sm:p-12 bg-[#150387]">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 rounded-lg border ${
                      errors.name ? 'border-destructive/50' : 'border-input'
                    } bg-white/5 form-input-focus input-transition text-lg font-ibm-plex`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.name}</p>
                  )}
                </div>
                
                {/* Segment Field */}
                <div className="space-y-2">
                  <label htmlFor="segment" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                    Segment
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className={`w-full px-4 py-4 rounded-lg border ${
                        errors.segment ? 'border-destructive/50' : 'border-input'
                      } bg-white/5 form-input-focus input-transition text-left flex justify-between items-center text-lg font-ibm-plex`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className={formData.segment ? 'text-foreground' : 'text-muted-foreground'}>
                        {formData.segment || "Select a segment"}
                      </span>
                      <ChevronDown size={20} className="text-muted-foreground" />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-black/70 shadow-lg max-h-60 overflow-auto border border-white/10">
                        <ul className="py-1 text-base">
                          {SEGMENTS.map((segment) => (
                            <li
                              key={segment}
                              className="relative cursor-pointer select-none py-3 px-4 hover:bg-primary/10 text-foreground font-ibm-plex"
                              onClick={() => selectSegment(segment)}
                            >
                              <div className="flex items-center justify-between">
                                <span>{segment}</span>
                                {formData.segment === segment && (
                                  <Check size={18} className="text-primary" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.segment && (
                    <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.segment}</p>
                  )}
                </div>
                
                {/* Experience Field */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="hasExperience"
                      name="hasExperience"
                      type="checkbox"
                      checked={formData.hasExperience}
                      onChange={handleChange}
                      className="h-5 w-5 text-primary rounded border-input bg-white/5 focus:ring-primary"
                    />
                    <label htmlFor="hasExperience" className="ml-2 block text-base-plus font-medium text-foreground font-ibm-plex">
                      I have experience in my selected segment
                    </label>
                  </div>
                  
                  {formData.hasExperience && (
                    <div className="mt-3">
                      <label htmlFor="experienceDetails" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                        Experience Details
                      </label>
                      <textarea
                        id="experienceDetails"
                        name="experienceDetails"
                        value={formData.experienceDetails}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-4 rounded-lg border ${
                          errors.experienceDetails ? 'border-destructive/50' : 'border-input'
                        } bg-white/5 form-input-focus input-transition text-lg font-ibm-plex mt-1`}
                        placeholder="Please describe your experience..."
                      />
                      {errors.experienceDetails && (
                        <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.experienceDetails}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                    Google Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 rounded-lg border ${
                      errors.email ? 'border-destructive/50' : 'border-input'
                    } bg-white/5 form-input-focus input-transition text-lg font-ibm-plex`}
                    placeholder="your.name@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.email}</p>
                  )}
                </div>
                
                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 rounded-lg border ${
                      errors.phone ? 'border-destructive/50' : 'border-input'
                    } bg-white/5 form-input-focus input-transition text-lg font-ibm-plex`}
                    placeholder="+123 456 7890"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.phone}</p>
                  )}
                </div>
                
                {/* Facebook Link Field */}
                <div className="space-y-2">
                  <label htmlFor="facebookLink" className="block text-base-plus font-medium text-foreground font-ibm-plex">
                    Facebook Profile Link
                  </label>
                  <input
                    id="facebookLink"
                    name="facebookLink"
                    type="url"
                    required
                    value={formData.facebookLink}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 rounded-lg border ${
                      errors.facebookLink ? 'border-destructive/50' : 'border-input'
                    } bg-white/5 form-input-focus input-transition text-lg font-ibm-plex`}
                    placeholder="https://facebook.com/your.profile"
                  />
                  {errors.facebookLink && (
                    <p className="text-destructive text-sm mt-1 font-ibm-plex">{errors.facebookLink}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/20 flex justify-center items-center text-xl font-ibm-plex"
                  >
                    {isSubmitting ? (
                      <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    ) : (
                      "Join Our Team"
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Image Section - Updated to take full height */}
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 hidden lg:block h-full">
              <img
                src="/lovable-uploads/82a18e5f-e62d-42b9-87de-261f2642fada.png"
                alt="NCTU Petroleum Tech"
                className="object-cover w-full h-full"
              />
              
              {/* Overlay gradient */}
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p className="mb-2 font-ibm-plex">© {new Date().getFullYear()} NCTU Petroleum Tech. All rights reserved.</p>
          <p className="font-ibm-plex">
            Form Created And Developed by{" "}
            <a 
              href="https://omar-abbas.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-ibm-plex"
            >
              Omar Radwan
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
