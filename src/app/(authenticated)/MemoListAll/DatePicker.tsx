import "@mantine/dates/styles.css";

import { Indicator } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";

const DatePickerComponent = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <Indicator>
      <DatePicker value={value} onChange={setValue} size="xs" />
    </Indicator>
  );
};

export default DatePickerComponent;
