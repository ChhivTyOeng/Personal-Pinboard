export function validateBoard(values) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Board name is required';
  } else if (values.name.trim().length > 100) {
    errors.name = 'Board name cannot exceed 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
