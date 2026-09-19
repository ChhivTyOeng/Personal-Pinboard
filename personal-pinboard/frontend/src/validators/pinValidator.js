export function validatePin(values) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length > 150) {
    errors.title = 'Title must be under 150 characters';
  }

  if (!values.image_url || !values.image_url.trim()) {
    errors.image_url = 'Image is required';
  } else if (
    !values.image_url.startsWith('http://') &&
    !values.image_url.startsWith('https://') &&
    !values.image_url.startsWith('data:')
  ) {
    errors.image_url = 'Image must be a valid URL (http/https) or uploaded file';
  }

  if (values.destination_url && !values.destination_url.startsWith('http://') && !values.destination_url.startsWith('https://')) {
    errors.destination_url = 'Destination link must start with http:// or https://';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
