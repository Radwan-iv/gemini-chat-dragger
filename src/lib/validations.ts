
export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  
  // Check if it's a Google email
  const googleEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!googleEmailRegex.test(email)) {
    return "Please enter a valid Google email address";
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return "Phone number is required";
  
  // Basic phone number validation
  // Allow formats like: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    return "Please enter a valid phone number";
  }
  
  return null;
};

export const validateFacebookLink = (link: string): string | null => {
  if (!link.trim()) return "Facebook link is required";
  
  // Check if it's a Facebook URL
  // This is a simple check - could be more comprehensive
  if (!link.includes('facebook.com/')) {
    return "Please enter a valid Facebook profile URL";
  }
  
  return null;
};

export const validateSegment = (segment: string): string | null => {
  if (!segment) return "Please select a segment";
  return null;
};

export const validateExperienceDetails = (hasExperience: boolean, details: string): string | null => {
  if (hasExperience && !details.trim()) {
    return "Please provide details about your experience";
  }
  return null;
};
