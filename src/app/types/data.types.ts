export type PersonalData = {
  firstName: string;
  lastName: string;
  birthNumber: string;
  countryId: string;
  cityId: string | undefined;
  email: string;
};

export type Timeslot = { id: string; time: string };

export type AvailableSlotsResponse = {
  slots: {
    [date: string]: { id: string; time: string }[];
  };
};
