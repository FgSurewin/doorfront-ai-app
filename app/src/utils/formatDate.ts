type FormatDateOptions = {
    includeTime?: boolean;
    locale?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
  };
  
  export function formatDate(dateString: string, options: FormatDateOptions = {}): string {
    const date = new Date(dateString);
  
    const {
      includeTime = true,
      locale = 'default',
      dateStyle = 'medium',
      timeStyle = 'short',
    } = options;
  
    return date.toLocaleString(locale, {
      dateStyle,
      ...(includeTime && { timeStyle }),
    });
  }
  