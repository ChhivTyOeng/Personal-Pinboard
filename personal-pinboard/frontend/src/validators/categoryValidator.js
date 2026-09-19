export function validateCategory(values) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Category name is required';
  } else if (values.name.trim().length > 50) {
    errors.name = 'Category name must be under 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
