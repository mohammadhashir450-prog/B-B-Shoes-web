/**
 * Professional Input Validation Utilities
 * For validating user inputs across the application
 */

/**
 * Email Validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password Validation
 * At least 6 characters
 */
export function isValidPassword(password: string): boolean {
  return Boolean(password && password.length >= 6);
}

/**
 * Phone Number Validation (Pakistan Format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Product Price Validation
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0;
}

/**
 * Required Field Validation
 */
export function validateRequired(fields: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${key} is required`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Product Validation
 */
export function validateProduct(product: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const price = Number(product.price);
  const originalPrice = Number(product.originalPrice);
  const discount = Number(product.discount);

  if (!product.name || product.name.trim() === '') {
    errors.push('Product name is required');
  }

  if (!Number.isFinite(price) || !isValidPrice(price)) {
    errors.push('Valid product price is required');
  }

  if (!product.category || product.category.trim() === '') {
    errors.push('Product category is required');
  }

  if (!product.brand || product.brand.trim() === '') {
    errors.push('Product brand is required');
  }

  if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
    errors.push('At least one size is required');
  }

  if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    errors.push('At least one color is required');
  }

  if (product.discount !== undefined && product.discount !== null && product.discount !== '') {
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      errors.push('Discount must be between 0 and 100');
    }
  }

  if (product.isOnSale) {
    if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
      errors.push('Sale discount must be between 1 and 100');
    }

    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      errors.push('Original price is required for sale products');
    }

    if (Number.isFinite(originalPrice) && Number.isFinite(price) && originalPrice <= price) {
      errors.push('Sale price must be less than original price');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Order Validation
 */
export function validateOrder(order: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!order.customerName || order.customerName.trim() === '') {
    errors.push('Customer name is required');
  }

  if (!order.customerEmail || !isValidEmail(order.customerEmail)) {
    errors.push('Valid customer email is required');
  }

  if (!order.customerPhone || !isValidPhone(order.customerPhone)) {
    errors.push('Valid customer phone is required');
  }

  if (!order.customerAddress || order.customerAddress.trim() === '') {
    errors.push('Customer address is required');
  }

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!order.total || !isValidPrice(order.total)) {
    errors.push('Valid order total is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Product Review Validation
 */
export function validateReview(review: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const name = String(review?.customerName || '').trim();
  const email = String(review?.customerEmail || '').trim();
  const comment = String(review?.comment || '').trim();
  const rating = Number(review?.rating);

  if (!name) {
    errors.push('Customer name is required');
  } else if (name.length < 2 || name.length > 80) {
    errors.push('Customer name must be between 2 and 80 characters');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid customer email is required');
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!comment) {
    errors.push('Review comment is required');
  } else if (comment.length < 10 || comment.length > 500) {
    errors.push('Review comment must be between 10 and 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * User Registration Validation
 */
export function validateRegistration(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  console.log('🔍 Validating registration:', { 
    hasName: !!data.name, 
    hasEmail: !!data.email, 
    hasPassword: !!data.password,
    nameValue: data.name,
    emailValue: data.email,
    passwordLength: data.password?.length
  });

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
    console.log('❌ Name validation failed');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
    console.log('❌ Email validation failed');
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push('Password must be at least 6 characters');
    console.log('❌ Password validation failed');
  }

  console.log('✅ Registration validation result:', { isValid: errors.length === 0, errors });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * User Login Validation
 */
export function validateLogin(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  console.log('🔍 Validating login:', { 
    hasEmail: !!data.email, 
    hasPassword: !!data.password,
    emailValue: data.email,
    passwordLength: data.password?.length
  });

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
    console.log('❌ Email validation failed');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required');
    console.log('❌ Password validation failed');
  }

  console.log('✅ Login validation result:', { isValid: errors.length === 0, errors });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
