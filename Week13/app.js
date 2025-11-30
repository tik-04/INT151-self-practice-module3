async function timeFormat(dataDate,data,resp) {
    const updatedAtDate = new Date(dataDate.toString());

    const dateOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      calendar: "gregory",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const dateFormatter = new Intl.DateTimeFormat(undefined, dateOptions);
    const timeFormatter = new Intl.DateTimeFormat(undefined, timeOptions);
    const datePart = dateFormatter.format(updatedAtDate);
    const timePart = timeFormatter.format(updatedAtDate);
    const resolved = timeFormatter.resolvedOptions();

    if (resp) return `${data.planCode} - ${data.planNameEng} as your plan on ${datePart}, ${timePart} (${resolved.timeZone})`;

    return `${data.planCode} - ${data.planNameEng} on ${datePart}, ${timePart} (${resolved.timeZone})`;
}

export default timeFormat