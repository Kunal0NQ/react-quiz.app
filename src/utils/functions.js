export  const formatDate = (date) => {
    const options = {
      weekday: 'long', // Full weekday name
      year: 'numeric', // Full year
      month: 'long', // Full month name
      day: 'numeric', // Day of the month
      hour: '2-digit', // Hours in 2-digit format
      minute: '2-digit', // Minutes in 2-digit format
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

